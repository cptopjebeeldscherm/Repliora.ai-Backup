import sys
import time
import json
import imaplib
import smtplib
import email
import hashlib
from email.message import EmailMessage
from pathlib import Path
import ssl
import requests
from datetime import datetime
from fastapi import APIRouter
import threading
import logging

sys.path.append(str(Path(__file__).resolve().parent.parent))

from core.utils import (
    load_replied_log,
    save_replied_log,
    get_user_path,
)
from api.analytics import update_analytics

router = APIRouter()

MAX_EMAILS_PER_RUN = 25
REPLY_DELAY = 2
MAX_LOG_ENTRIES = 1000
RETRY_ATTEMPTS = 3
RETRY_QUEUE_FILE = "retry_queue.json"
RATE_LIMIT_FILE = "rate_limit_log.json"
RUNTIME_METRICS_FILE = "runtime_metrics.json"
STORE_INFO_FILE = "store_info.json"
KILL_SWITCH = "STOP_BOT.txt"
RUN_INTERVAL_SECONDS = 60

IMAP_SERVER = "imap.gmail.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
TEST_MODE = False
LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "email_bot.log"

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


def list_all_users():
    user_storage_path = Path(__file__).resolve().parent.parent / "storage" / "users"
    return [d.name for d in user_storage_path.iterdir() if d.is_dir()]


def load_confidence_threshold(user):
    path = get_user_path(user, "confidence_threshold.json")
    if path.exists():
        with open(path) as f:
            return json.load(f).get("threshold", 0.7)
    return 0.7


def load_email_credentials(user):
    path = get_user_path(user, "email_credentials.json")
    try:
        with open(path) as f:
            creds = json.load(f)
            return creds["email"], creds["password"]
    except Exception as e:
        logging.error(f"Failed to load credentials for {user}: {e}")
        return None, None


def load_json(path):
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return []


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data[-MAX_LOG_ENTRIES:], f, indent=2)


def append_to_log(user, filename, item):
    path = get_user_path(user, filename)
    log = load_json(path)
    log.append(item)
    save_json(path, log)


def send_reply(from_email, from_pass, to_email, subject, body):
    msg = EmailMessage()
    msg["Subject"] = f"Re: {subject}"
    msg["From"] = from_email
    msg["To"] = to_email
    msg.set_content(body)

    for attempt in range(RETRY_ATTEMPTS):
        try:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
                smtp.starttls(context=ssl.create_default_context())
                smtp.login(from_email, from_pass)
                smtp.send_message(msg)
            logging.info(f"Reply sent to {to_email}.")
            return True
        except Exception as e:
            wait = [5, 15, 30][attempt]
            logging.warning(
                f"Send failed (attempt {attempt + 1}) — retrying in {wait}s... Error: {e}"
            )
            time.sleep(wait)
    return False


def extract_email_body(msg):
    try:
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    return part.get_payload(decode=True).decode(errors="replace")
        return msg.get_payload(decode=True).decode(errors="replace")
    except:
        return "(Unreadable content)"


def get_user_plan(user):
    path = get_user_path(user, STORE_INFO_FILE)
    if path.exists():
        with open(path) as f:
            return json.load(f).get("plan", "starter")
    return "starter"


def get_replies_this_month(user):
    path = get_user_path(user, RATE_LIMIT_FILE)
    now = datetime.utcnow()
    log = load_json(path)
    monthly_log = [
        entry for entry in log if entry.get("month") == now.strftime("%Y-%m")
    ]
    return len(monthly_log)


def log_reply_sent(user):
    path = get_user_path(user, RATE_LIMIT_FILE)
    log = load_json(path)
    log.append(
        {
            "month": datetime.utcnow().strftime("%Y-%m"),
            "timestamp": datetime.utcnow().isoformat(),
        }
    )
    save_json(path, log)


def has_duplicate_body(user, body):
    hash_val = hashlib.sha256(body.encode()).hexdigest()
    path = get_user_path(user, "answered_emails.json")
    answered = load_json(path)
    return any(
        hashlib.sha256(entry["message"].encode()).hexdigest() == hash_val
        for entry in answered
    )


def update_runtime_metrics(user, key):
    path = get_user_path(user, RUNTIME_METRICS_FILE)
    metrics = {}
    if path.exists():
        with open(path) as f:
            metrics = json.load(f)
    metrics[key] = metrics.get(key, 0) + 1
    save_json(path, metrics)


def check_and_reply_to_emails(user):
    if Path(KILL_SWITCH).exists():
        logging.warning("Kill switch detected. Stopping bot.")
        return

    logging.info(f"Checking inbox for: {user}")
    email_addr, email_pass = load_email_credentials(user)
    if not email_addr or not email_pass:
        return

    replied_log = load_replied_log(user)
    confidence_threshold = load_confidence_threshold(user)
    plan = get_user_plan(user)
    reply_count = get_replies_this_month(user)

    if plan == "starter" and reply_count >= 150:
        logging.info("Monthly reply limit reached for Starter plan.")
        return

    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(email_addr, email_pass)
        mail.select("inbox")

        status, messages = mail.search(None, "(UNSEEN)")
        mail_ids = messages[0].split()
        logging.info(f"{len(mail_ids)} unread emails.")

        for email_id in mail_ids[:MAX_EMAILS_PER_RUN]:
            if Path(KILL_SWITCH).exists():
                break

            status, data = mail.fetch(email_id, "(RFC822)")
            msg = email.message_from_bytes(data[0][1])
            msg_id = msg.get("Message-ID")
            if msg_id in replied_log:
                continue

            sender = email.utils.parseaddr(msg["From"])[1]
            subject = msg["Subject"] or "(no subject)"
            body = extract_email_body(msg)

            if has_duplicate_body(user, body):
                logging.info("Duplicate email body detected, skipping.")
                continue

            logging.info(f"From: {sender}, Subject: {subject}")

            for attempt in range(RETRY_ATTEMPTS):
                try:
                    res = requests.post(
                        "http://localhost:8000/match-faq",
                        json={"message": body, "faqs": []},
                    )
                    reply_data = res.json()
                    break
                except Exception as e:
                    wait = [5, 15, 30][attempt]
                    logging.error(f"Template fetch failed (try {attempt+1}): {e}")
                    time.sleep(wait)
            else:
                append_to_log(
                    user,
                    RETRY_QUEUE_FILE,
                    {
                        "from": sender,
                        "subject": subject,
                        "message": body,
                        "error": "template fetch failed",
                    },
                )
                continue

            reply = reply_data.get("answer")
            intent = reply_data.get("category")
            confidence = reply_data.get("confidence", 0.0)

            if not reply or confidence < confidence_threshold:
                append_to_log(
                    user,
                    "unanswered_emails.json",
                    {
                        "from": sender,
                        "subject": subject,
                        "message": body,
                        "confidence": confidence,
                    },
                )
                update_analytics(
                    {
                        "total_emails_processed": 1,
                        "total_replied": 0,
                        "total_unanswered": 1,
                        "average_confidence": confidence,
                    },
                    user,
                )
                update_runtime_metrics(user, "unanswered")
                continue

            if not TEST_MODE:
                success = send_reply(email_addr, email_pass, sender, subject, reply)
                if not success:
                    append_to_log(
                        user,
                        RETRY_QUEUE_FILE,
                        {
                            "from": sender,
                            "subject": subject,
                            "message": body,
                            "reply": reply,
                            "intent": intent,
                            "confidence": confidence,
                        },
                    )
                    continue

                replied_log.add(msg_id)
                save_replied_log(replied_log, user)
                log_reply_sent(user)

            append_to_log(
                user,
                "answered_emails.json",
                {
                    "from": sender,
                    "subject": subject,
                    "message": body,
                    "intent": intent,
                    "confidence": confidence,
                    "reply": reply,
                },
            )
            update_analytics(
                {
                    "total_emails_processed": 1,
                    "total_replied": 1,
                    "total_unanswered": 0,
                    "average_confidence": confidence,
                },
                user,
            )
            update_runtime_metrics(user, "replied")
            time.sleep(REPLY_DELAY)

        mail.logout()

    except KeyboardInterrupt:
        logging.warning("Keyboard interrupt — shutting down cleanly.")
    except Exception as e:
        logging.error(f"ERROR: {e}")


def run_bot():
    threads = []
    users = list_all_users()
    for user in users:
        t = threading.Thread(target=check_and_reply_to_emails, args=(user,))
        t.start()
        threads.append(t)
    for t in threads:
        t.join()


if __name__ == "__main__":
    while True:
        if Path(KILL_SWITCH).exists():
            logging.warning("Kill switch detected. Terminating loop.")
            break
        run_bot()
        logging.info(f"Sleeping for {RUN_INTERVAL_SECONDS} seconds...")
        time.sleep(RUN_INTERVAL_SECONDS)
