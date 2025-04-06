# backend/api/confidence.py

from fastapi import APIRouter, Request, HTTPException
from core.utils import get_user_email, get_user_path
import json

router = APIRouter()


# ──────────────────────────────
# 📁 Load & Save per-user confidence threshold
# ──────────────────────────────
def load_confidence_threshold(user_email: str):
    path = get_user_path(user_email, "confidence_threshold.json")
    if path.exists():
        with open(path, "r") as f:
            return json.load(f)
    return {"threshold": 0.6}


def save_confidence_threshold(user_email: str, threshold: float):
    path = get_user_path(user_email, "confidence_threshold.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump({"threshold": threshold}, f, indent=2)


# ──────────────────────────────
# ✅ GET confidence threshold
# ──────────────────────────────
@router.get("/confidence-threshold")
def get_threshold(request: Request):
    user_email = get_user_email(request)
    return load_confidence_threshold(user_email)


# ──────────────────────────────
# ✅ POST confidence threshold
# ──────────────────────────────
@router.post("/confidence-threshold")
async def set_threshold(request: Request):
    user_email = get_user_email(request)
    data = await request.json()
    threshold = data.get("threshold", 0.6)
    save_confidence_threshold(user_email, threshold)
    return {"message": "Threshold updated!", "threshold": threshold}
