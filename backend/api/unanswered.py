from fastapi import APIRouter, HTTPException, Request
import json
from core.utils import get_user_email, initialize_user_files, get_user_path

router = APIRouter()


# ─────────────────────────────────────────────
# 📥 Load + Save
# ─────────────────────────────────────────────
def load_unanswered_emails(email: str):
    file = get_user_path(email, "unanswered_emails.json")
    if file.exists():
        with open(file, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_unanswered_emails(email: str, data):
    file = get_user_path(email, "unanswered_emails.json")
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# ─────────────────────────────────────────────
# ✅ GET All Unanswered Emails (sorted by score)
# ─────────────────────────────────────────────
@router.get("/unanswered")
def get_unanswered_emails(request: Request):
    user_email = get_user_email(request)
    if not user_email:
        raise HTTPException(status_code=400, detail="Missing x-user-email header")

    initialize_user_files(user_email)
    emails = load_unanswered_emails(user_email)
    sorted_emails = sorted(emails, key=lambda x: x.get("score", 0), reverse=True)
    return sorted_emails


# ─────────────────────────────────────────────
# ❌ DELETE Specific Unanswered Email
# ─────────────────────────────────────────────
@router.delete("/unanswered/{index}")
def delete_unanswered_email(index: int, request: Request):
    user_email = get_user_email(request)
    if not user_email:
        raise HTTPException(status_code=400, detail="Missing x-user-email header")

    initialize_user_files(user_email)
    unanswered_emails = load_unanswered_emails(user_email)
    if 0 <= index < len(unanswered_emails):
        removed = unanswered_emails.pop(index)
        save_unanswered_emails(user_email, unanswered_emails)
        return {"status": "success", "removed_email": removed}

    raise HTTPException(status_code=404, detail="Email index out of range")
