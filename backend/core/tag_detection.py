import json
import re
from pathlib import Path

TAG_FILE = Path(__file__).resolve().parent.parent / "config" / "tags.json"


def load_tags():
    if not TAG_FILE.exists():
        raise FileNotFoundError("⚠️ tags.json not found.")
    with open(TAG_FILE, "r") as f:
        return json.load(f)


def clean_text(text):
    return re.sub(r"[^\w\s]", "", text.lower())


def detect_tags(message: str) -> list:
    message = clean_text(message)
    tag_data = load_tags()
    matched_tags = []

    for tag, keywords in tag_data.items():
        for keyword in keywords:
            if keyword in message:
                matched_tags.append(tag)
                break

    return matched_tags
