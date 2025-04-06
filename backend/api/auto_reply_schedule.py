# backend/api/auto_reply_schedule.py

from fastapi import APIRouter, Request, HTTPException
from core.utils import get_user_email, get_user_path
from pathlib import Path
import json

router = APIRouter()


# ──────────────────────────────
# 📥 Load + Save per user
# ──────────────────────────────
def load_schedule(user_email: str):
    path = get_user_path(user_email, "auto_reply_schedule.json")
    if path.exists():
        with open(path, "r") as f:
            return json.load(f)
    return {"enabled": False, "start": "09:00", "end": "17:00"}


def save_schedule(user_email: str, data):
    path = get_user_path(user_email, "auto_reply_schedule.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


# ──────────────────────────────
# ✅ GET user schedule
# ──────────────────────────────
@router.get("/auto-reply-schedule")
def get_schedule(request: Request):
    user_email = get_user_email(request)
    return load_schedule(user_email)


# ──────────────────────────────
# ✅ POST update user schedule
# ──────────────────────────────
@router.post("/auto-reply-schedule")
def update_schedule(request: Request, payload: dict):
    user_email = get_user_email(request)
    save_schedule(user_email, payload)
    return {"status": "Schedule updated", "schedule": payload}
