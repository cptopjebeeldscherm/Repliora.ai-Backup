# backend/api/auto_sync.py

from fastapi import APIRouter, Request, HTTPException
from pathlib import Path
from core.utils import get_user_email, get_user_path
from core.scheduler import start_auto_sync_job
import json

router = APIRouter()


# ──────────────────────────────
# 📁 Load + Save per user
# ──────────────────────────────
def load_auto_sync_settings(user_email: str):
    path = get_user_path(user_email, "auto_sync_settings.json")
    if path.exists():
        with open(path, "r") as f:
            return json.load(f)
    return {"enabled": False, "interval": 15}


def save_auto_sync_settings(user_email: str, data):
    path = get_user_path(user_email, "auto_sync_settings.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


# ──────────────────────────────
# ✅ GET Sync Settings
# ──────────────────────────────
@router.get("/auto-sync-settings")
def get_auto_sync_settings(request: Request):
    user_email = get_user_email(request)
    return load_auto_sync_settings(user_email)


# ──────────────────────────────
# ✅ POST Sync Settings
# ──────────────────────────────
@router.post("/auto-sync-settings")
def update_auto_sync_settings(request: Request, payload: dict):
    user_email = get_user_email(request)
    save_auto_sync_settings(user_email, payload)

    if payload.get("enabled"):
        start_auto_sync_job(payload.get("interval", 15))

    return {"status": "updated", "sync": payload}
