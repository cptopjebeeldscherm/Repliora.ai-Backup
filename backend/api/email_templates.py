# backend/api/email_templates.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from core.utils import get_user_path, get_user_email
import json

router = APIRouter()


# ──────────────────────────────
# 📁 Per-user file path
# ──────────────────────────────
def get_template_path(email: str):
    return get_user_path(email, "email_templates.json")


# ──────────────────────────────
# ✅ GET all templates (per user)
# ──────────────────────────────
@router.get("/get-all-templates")
async def get_all_templates(request: Request):
    user_email = get_user_email(request)
    path = get_template_path(user_email)

    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


# ──────────────────────────────
# ✅ POST save templates (per user)
# ──────────────────────────────
@router.post("/save-templates")
async def save_templates(request: Request):
    user_email = get_user_email(request)
    try:
        data = await request.json()
        path = get_template_path(user_email)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        return {"status": "ok"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
