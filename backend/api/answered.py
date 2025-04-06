# backend/api/answered.py

from fastapi import APIRouter, HTTPException, Request
from core.utils import get_user_email, get_user_path
import json
from pathlib import Path

router = APIRouter()


# ──────────────────────────────
# 📥 Load + Save Answered Emails
# ──────────────────────────────
def load_answered_emails(user_email: str):
    path = get_user_path(user_email, "answered_emails.json")
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_answered_emails(user_email: str, data):
    path = get_user_path(user_email, "answered_emails.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# ──────────────────────────────
# ✅ GET all answered emails
# ──────────────────────────────
@router.get("/answered-emails")
def get_answered_emails(request: Request):
    user_email = get_user_email(request)
    return load_answered_emails(user_email)


# ──────────────────────────────
# ❌ DELETE answered email by index
# ──────────────────────────────
@router.delete("/answered-emails/{index}")
def delete_answered_email(index: int, request: Request):
    user_email = get_user_email(request)
    emails = load_answered_emails(user_email)

    if 0 <= index < len(emails):
        removed = emails.pop(index)
        save_answered_emails(user_email, emails)
        return {"status": "deleted", "removed_email": removed}

    raise HTTPException(status_code=404, detail="Index out of range")
