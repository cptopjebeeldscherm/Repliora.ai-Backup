# backend/api/self_learning.py

import json
import imaplib
import smtplib
import email
from email.message import EmailMessage
import ssl
from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path

from main import get_best_match, load_faqs
from core.utils import load_replied_log, save_replied_log, get_user_path
from api.analytics import update_analytics

router = APIRouter()


# 📦 Request model
class Question(BaseModel):
    question: str
    user: str  # Support per-user


# 📧 Email constants
IMAP_SERVER = "imap.gmail.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
TEST_MODE = True


# ─────────────────────────────────────────────
# 📁 Loaders per user
# ─────────────────────────────────────────────
def load_confidence_threshold(user: str):
    path = get_user_path(user, "confidence_threshold.json")
    if path.exists():
        with open(path, "r") as f:
            return json.load(f).get("threshold", 0.7)
    return 0.7


def load_email_credentials(user: str):
    path = get_user_path(user, "email_credentials.json")
    try:
        with open(path, "r") as f:
            credentials = json.load(f)
            return credentials["email"], credentials["password"]
    except:
        print("❌ Couldn't load credentials.")
        return None, None


def load_unanswered_emails(user: str):
    path = get_user_path(user, "unanswered_emails.json")
    try:
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def save_unanswered_emails(user: str, data):
    path = get_user_path(user, "unanswered_emails.json")
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def extract_email_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                payload = part.get_payload(decode=True)
                if payload:
                    return payload.decode(errors="replace")
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            return payload.decode(errors="replace")
    return "(No readable content)"


# ─────────────────────────────────────────────
# 🤖 Email Reply Logic
# ─────────────────────────────────────────────
def check_and_reply_to_emails(user: str):
    print(f"📬 Checking inbox for user: {user}")
    EMAIL, PASSWORD = load_email_credentials(user)
    CONFIDENCE_THRESHOLD = load_confidence_threshold(user)
    replied_log = load_replied_log(user)

    if not EMAIL or not PASSWORD:
        print("❌ Missing credentials for user.")
        return

    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(EMAIL, PASSWORD)
        mail.select("inbox")

        status, messages = mail.search(None, "(UNSEEN)")
        if status != "OK" or not messages[0]:
            print("🚫 No unread emails.")
            return

        for email_id in messages[0].split():
            status, msg_data = mail.fetch(email_id, "(RFC822)")
            if status != "OK":
                continue

            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)

            message_id = msg.get("Message-ID")
            if message_id in replied_log:
                print(f"🔁 Already replied to {message_id}, skipping.")
                continue

            from_email = email.utils.parseaddr(msg["From"])[1]
            subject = msg["Subject"] or "(no subject)"
            body = extract_email_body(msg)

            print(f"\n📧 From: {from_email}\n📝 Subject: {subject}\n💬 Body:\n{body}")

            faqs = load_faqs(user)
            answer, score = get_best_match(body, faqs)
            print(f"🧠 Confidence: {score:.2f}")

            if score >= CONFIDENCE_THRESHOLD:
                print(f"✅ Reply:\n{answer}")
                if not TEST_MODE:
                    send_reply(EMAIL, PASSWORD, from_email, subject, answer)
                    replied_log.add(message_id)
                    save_replied_log(replied_log, user)

                update_analytics(
                    {
                        "total_emails_processed": 1,
                        "total_replied": 1,
                        "total_unanswered": 0,
                        "average_confidence": score,
                    }
                )
            else:
                print("⚠️ No confident match. Logging unanswered.")
                unanswered = load_unanswered_emails(user)
                unanswered.append({"body": body, "score": round(score, 2)})
                save_unanswered_emails(user, unanswered)

                update_analytics(
                    {
                        "total_emails_processed": 1,
                        "total_replied": 0,
                        "total_unanswered": 1,
                        "average_confidence": score,
                    }
                )

    except Exception as e:
        print("❌ ERROR:", e)


# ─────────────────────────────────────────────
# ✉️ Send reply
# ─────────────────────────────────────────────
def send_reply(sender_email, sender_pass, to_email, subject, body):
    print(f"📤 Sending reply to {to_email}...")
    msg = EmailMessage()
    msg["Subject"] = f"Re: {subject}"
    msg["From"] = sender_email
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
            smtp.starttls(context=ssl.create_default_context())
            smtp.login(sender_email, sender_pass)
            smtp.send_message(msg)
            print("✅ Email sent.")
    except Exception as e:
        print("❌ Sending failed:", e)


# ─────────────────────────────────────────────
# 📥 Manual Add to Unanswered
# ─────────────────────────────────────────────
@router.post("/save-unanswered")
def save_unanswered_email(question: Question):
    unanswered = load_unanswered_emails(question.user)
    unanswered.append(question.question)
    save_unanswered_emails(question.user, unanswered)
    return {"message": "Added to unanswered."}


# ─────────────────────────────────────────────
# 🧪 Dev Run (CLI only)
# ─────────────────────────────────────────────
if __name__ == "__main__":
    check_and_reply_to_emails("demo@yourmail.com")
