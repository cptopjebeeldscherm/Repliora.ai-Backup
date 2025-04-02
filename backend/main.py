from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import json
from pathlib import Path

# Load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# File path
STORAGE_PATH = Path("storage/faqs.json")

# Load saved FAQs on startup
def load_faqs():
    if STORAGE_PATH.exists():
        with open(STORAGE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# Save FAQs to file
def save_faqs(data):
    with open("storage/faqs.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# Load on boot
faq_list = load_faqs()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FAQItem(BaseModel):
    question: str
    answer: str

class MatchRequest(BaseModel):
    message: str
    faqs: list[FAQItem]

@app.post("/match-faq")
def match_faq(req: MatchRequest):
    if not req.faqs:
        return { "answer": "No FAQs available." }

    questions = [faq.question for faq in req.faqs]
    answers = [faq.answer for faq in req.faqs]

    q_embeddings = model.encode(questions, convert_to_tensor=True)
    user_embedding = model.encode(req.message, convert_to_tensor=True)
    scores = util.cos_sim(user_embedding, q_embeddings)[0]

    best_idx = scores.argmax().item()
    best_score = scores[best_idx].item()

    if best_score < 0.5:
        return { "answer": "I'm not sure how to help with that." }

    return { "answer": answers[best_idx] }

@app.post("/save-faqs")
def save_uploaded_faqs(faqs: list[FAQItem]):
    global faq_list
    faq_list = faqs

    # Convert Pydantic models (FAQItem) to plain dicts before saving
    plain_faqs = [faq.dict() for faq in faqs]

    save_faqs(plain_faqs)
    return { "message": "FAQs saved successfully." }

@app.get("/load-faqs")
def get_saved_faqs():
    return faq_list

# main.py

def get_best_match(message: str, faqs: list):
    questions = [faq["question"] for faq in faqs]
    answers = [faq["answer"] for faq in faqs]

    message_embedding = model.encode([message], convert_to_tensor=True)
    question_embeddings = model.encode(questions, convert_to_tensor=True)

    scores = util.cos_sim(message_embedding, question_embeddings)[0]
    best_score = float(scores.max())
    best_index = int(scores.argmax())

    return answers[best_index], best_score

