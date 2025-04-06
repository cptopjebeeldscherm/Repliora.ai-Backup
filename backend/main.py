from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import json
import os
from pathlib import Path
from core.intent_detection import detect_intent
from core.tag_detection import detect_tags
from api.email_templates import get_all_templates
from api.analytics import router as analytics_router
from api.unanswered import router as unanswered_router
from api.confidence import router as confidence_router
from api import (
    auto_reply_schedule,
    auto_sync,
    shopify_integration,
    email_templates,
    shopify_controller,
    answered,
    store_info,
)
from api.auth import router as auth_router
from core.utils import get_user_path, get_user_email

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("all-MiniLM-L6-v2")

# Include routers
app.include_router(analytics_router)
app.include_router(unanswered_router)
app.include_router(confidence_router)
app.include_router(auto_reply_schedule.router)
app.include_router(auto_sync.router)
app.include_router(shopify_integration.router)
app.include_router(email_templates.router)
app.include_router(shopify_controller.router)
app.include_router(answered.router)
app.include_router(store_info.router)
app.include_router(auth_router)


# ──────────────────────────────
# 📦 Models
# ──────────────────────────────
class FAQItem(BaseModel):
    question: str
    answer: str


# ──────────────────────────────
# 📁 File Handling
# ──────────────────────────────
def load_faqs(user_email: str):
    from api.analytics import initialize_faq_if_empty

    initialize_faq_if_empty(user_email)

    path = get_user_path(user_email, "faqs.json")
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_faqs(user_email: str, data):
    path = get_user_path(user_email, "faqs.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def load_store_info(user_email: str):
    path = get_user_path(user_email, "store_info.json")
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def load_credentials(user_email: str):
    path = get_user_path(user_email, "email_credentials.json")
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


# ──────────────────────────────
# 🔍 Match FAQ Endpoint
# ──────────────────────────────
@app.post("/match-faq")
async def match_faq(request: Request):
    import re
    from difflib import get_close_matches

    user_email = get_user_email(request)
    if not user_email or user_email == "unknown_user":
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = await request.json()
    message = data.get("message", "")
    faqs = data.get("faqs") or load_faqs(user_email)

    intent, confidence = detect_intent(message)
    tags = detect_tags(message)

    templates = await get_all_templates(user_email)
    category_templates = templates.get(intent, {})

    possible = get_close_matches(
        message.lower(), category_templates.keys(), n=1, cutoff=0.3
    )
    selected_template_key = possible[0] if possible else None

    if selected_template_key:
        raw_template = category_templates[selected_template_key]
        store_info = load_store_info(user_email)

        def fill_placeholders(text, data):
            for key, val in data.items():
                text = re.sub(rf"\[{key}\]", val, text)
            return text

        reply = fill_placeholders(raw_template, store_info)
        return {
            "category": intent,
            "tags": tags,
            "template": selected_template_key,
            "confidence": confidence,
            "answer": reply,
        }

    if not faqs:
        return {"tags": tags, "answer": "No FAQs available."}

    questions = [faq["question"] for faq in faqs]
    answers = [faq["answer"] for faq in faqs]
    q_embeddings = model.encode(questions, convert_to_tensor=True)
    user_embedding = model.encode(message, convert_to_tensor=True)
    scores = util.cos_sim(user_embedding, q_embeddings)[0]

    best_idx = scores.argmax().item()
    best_score = scores[best_idx].item()

    if best_score < 0.5:
        return {"tags": tags, "answer": "I'm not sure how to help with that."}

    return {"tags": tags, "answer": answers[best_idx]}


# ──────────────────────────────
# 💾 Save FAQs
# ──────────────────────────────
@app.post("/save-faqs")
async def save_uploaded_faqs(request: Request):
    user_email = get_user_email(request)
    if not user_email or user_email == "unknown_user":
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = await request.json()
    save_faqs(user_email, data)
    return {"message": "FAQs saved successfully."}


# ──────────────────────────────
# 📤 Load FAQs
# ──────────────────────────────
@app.get("/load-faqs")
async def get_saved_faqs(request: Request):
    user_email = get_user_email(request)
    if not user_email or user_email == "unknown_user":
        raise HTTPException(status_code=401, detail="Unauthorized")

    return load_faqs(user_email)


# ──────────────────────────────
# 🔐 Save Email Credentials (Per User)
# ──────────────────────────────
@app.post("/save-email-credentials")
async def save_email_credentials(request: Request):
    try:
        user_email = get_user_email(request)
        if not user_email or user_email == "unknown_user":
            raise HTTPException(status_code=401, detail="Unauthorized")

        data = await request.json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JSONResponse(
                content={"error": "Email and password are required"}, status_code=400
            )

        path = get_user_path(user_email, "email_credentials.json")
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", encoding="utf-8") as f:
            json.dump({"email": email, "password": password}, f)

        return {"message": "Credentials saved successfully!"}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# ──────────────────────────────
# 🔐 Load Email Credentials (Per User)
# ──────────────────────────────
@app.get("/load-email-credentials")
async def load_email_credentials(request: Request):
    try:
        user_email = get_user_email(request)
        if not user_email or user_email == "unknown_user":
            raise HTTPException(status_code=401, detail="Unauthorized")

        creds = load_credentials(user_email)
        return creds
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# ──────────────────────────────
# 🧠 Utility for Local Semantic Match
# ──────────────────────────────
def get_best_match(message: str, faqs: list):
    questions = [faq["question"] for faq in faqs]
    answers = [faq["answer"] for faq in faqs]
    message_embedding = model.encode([message], convert_to_tensor=True)
    question_embeddings = model.encode(questions, convert_to_tensor=True)
    scores = util.cos_sim(message_embedding, question_embeddings)[0]
    best_score = float(scores.max())
    best_index = int(scores.argmax())
    return answers[best_index], best_score


# ──────────────────────────────
# 🧠 Get Global Analytics
# ──────────────────────────────
ANALYTICS_FILE = Path("data/analytics.json")


@app.get("/global-analytics")
def get_global_analytics():
    if not os.path.exists(ANALYTICS_FILE):
        return {
            "total_emails_processed": 0,
            "total_replied": 0,
            "unanswered_emails": 0,
            "confidence_score": 0.0,
        }

    with open(ANALYTICS_FILE, "r") as f:
        return json.load(f)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
