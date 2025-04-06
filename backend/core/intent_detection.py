import json
import re
from pathlib import Path

INTENT_FILE = Path(__file__).resolve().parent.parent / "config" / "intents.json"


def load_intents():
    if not INTENT_FILE.exists():
        raise FileNotFoundError("⚠️ intents.json not found.")
    with open(INTENT_FILE, "r") as f:
        return json.load(f)


def clean_text(text):
    return re.sub(r"[^\w\s]", "", text.lower())


def detect_intent(message):
    message = clean_text(message)
    intents = load_intents()

    scores = {}

    for intent, keywords in intents.items():
        match_count = sum(1 for keyword in keywords if keyword in message)
        scores[intent] = match_count

    best_match = max(scores, key=scores.get)
    confidence = (
        scores[best_match] / len(intents[best_match]) if intents[best_match] else 0
    )

    return best_match if scores[best_match] > 0 else None, round(confidence, 2)
