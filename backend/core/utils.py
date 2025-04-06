import json
import os
from difflib import SequenceMatcher
from pathlib import Path
from fastapi import Request
from typing import Union

# Default file paths (used only for global fallback if needed)
FAQS_FILE = Path(__file__).resolve().parent.parent / "storage" / "faqs.json"
LOG_FILE = Path(__file__).resolve().parent.parent / "storage" / "replied_log.json"
ANALYTICS_FILE = Path(__file__).resolve().parent.parent / "data" / "analytics_data.json"

DEFAULT_FILES = {
    "faqs.json": [],
    "email_templates.json": {},
    "unanswered_emails.json": [],
    "answered_emails.json": [],
    "store_info.json": {},
    "confidence_threshold.json": {"threshold": 0.6},
    "email_credentials.json": {"email": "", "password": ""},
    "replied_log.json": [],
}


# ─────────────────────────────────────────────
# 📊 Analytics Data (Global)
# ─────────────────────────────────────────────
def load_analytics_data():
    if not os.path.exists(ANALYTICS_FILE):
        return {
            "total_emails_processed": 0,
            "total_replied": 0,
            "unanswered_emails": 0,
            "confidence_score": 0.0,
        }

    with open(ANALYTICS_FILE, "r") as f:
        return json.load(f)


def save_analytics_data(data):
    with open(ANALYTICS_FILE, "w") as f:
        json.dump(data, f, indent=2)


# ─────────────────────────────────────────────
# ✅ Global fallback logs
# ─────────────────────────────────────────────
def load_replied_log(user: str = None):
    log_path = get_user_path(user, "replied_log.json") if user else LOG_FILE

    if log_path.exists():
        with open(log_path, "r") as f:
            try:
                return set(json.load(f))
            except json.JSONDecodeError:
                return set()
    return set()


def save_replied_log(log_set, user: str = None):
    log_path = get_user_path(user, "replied_log.json") if user else LOG_FILE

    with open(log_path, "w") as f:
        json.dump(list(log_set), f, indent=2)


# ─────────────────────────────────────────────
# 📥 Load FAQs (global or user-scoped)
# ─────────────────────────────────────────────
def load_faqs(user: str = None):
    faq_path = get_user_path(user, "faqs.json") if user else FAQS_FILE

    if faq_path.exists():
        with open(faq_path, "r") as f:
            return json.load(f)
    return []


# ─────────────────────────────────────────────
# 🤖 Match logic (used for fallback matching)
# ─────────────────────────────────────────────
def get_best_match(message, faqs):
    best_score = 0
    best_answer = "Sorry, I couldn't find an answer."
    for faq in faqs:
        score = SequenceMatcher(None, message.lower(), faq["question"].lower()).ratio()
        if score > best_score:
            best_score = score
            best_answer = faq["answer"]
    return best_answer, best_score


# ─────────────────────────────────────────────
# 👥 User-based Utilities
# ─────────────────────────────────────────────
def sanitize_email(email: str) -> str:
    return email.replace("@", "_at_").replace(".", "_dot_") if email else "unknown_user"


def get_user_path(email: Union[str, None], filename: str) -> Path:
    safe_email = sanitize_email(email)

    # ✅ Anchor this to the backend root, not relative to utils.py
    backend_root = Path(__file__).resolve().parent.parent  # <== points to /backend
    folder = backend_root / "storage" / "users" / safe_email
    folder.mkdir(parents=True, exist_ok=True)

    return folder / filename


def get_user_email(request: Request) -> Union[str, None]:
    if request is None:
        print("⚠️ Warning: request was None in get_user_email()")
        return None
    return request.headers.get("x-user-email")


def initialize_user_files(email: str):
    """
    Ensure that all expected files exist for a user.
    """
    files = {
        "faqs.json": [],
        "email_templates.json": {},
        "unanswered_emails.json": [],
        "answered_emails.json": [],
        "store_info.json": {},
        "confidence_threshold.json": {"threshold": 0.6},
        "email_credentials.json": {"email": "", "password": ""},
        "replied_log.json": [],
    }

    for filename, default_content in files.items():
        path = get_user_path(email, filename)
        if not path.exists():
            with open(path, "w", encoding="utf-8") as f:
                json.dump(default_content, f, indent=2)
