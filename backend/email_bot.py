import imaplib
import smtplib
import email
from email.message import EmailMessage
import ssl
from main import get_best_match, load_faqs
from utils import load_replied_log, save_replied_log

# 📫 Email credentials
EMAIL = "oh.korucu@gmail.com"
PASSWORD = "ixfe aezn qcsn vgdv"

IMAP_SERVER = "imap.gmail.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

CONFIDENCE_THRESHOLD = 0.6
TEST_MODE = True  # Set to False when you want to send emails

# Load previously replied message IDs
replied_log = load_replied_log()


def check_and_reply_to_emails():
    print("📬 Checking inbox...")

    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(EMAIL, PASSWORD)
        mail.select("inbox")

        status, messages = mail.search(None, "(UNSEEN)")
        if status != "OK":
            print("🚫 No new emails.")
            return

        email_ids = messages[0].split()
        if not email_ids:
            print("🚫 No unread emails.")
            return

        for email_id in email_ids:
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
            body = ""

            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/plain":
                        body = part.get_payload(decode=True).decode(errors="replace")
                        break
            else:
                body = msg.get_payload(decode=True).decode(errors="replace")

            print(f"\n📧 From: {from_email}")
            print(f"📝 Subject: {subject}")
            print(f"💬 Body:\n{body}")

            faqs = load_faqs()
            print("🔍 Matching against FAQ...")
            answer, score = get_best_match(body, faqs)
            print(f"🧠 Matching confidence: {score:.2f}")

            if score >= CONFIDENCE_THRESHOLD:
                print("✅ Confident match found!")
                print(f"📨 Reply:\n{answer}")

                if not TEST_MODE:
                    send_reply(from_email, subject, answer)
                    replied_log.add(message_id)
                    save_replied_log(replied_log)
                else:
                    print("🔁 TEST_MODE is ON — no reply sent.")
            else:
                print("⚠️ No strong match — not replying.")

    except Exception as e:
        print("❌ ERROR:", e)


def send_reply(to_email, subject, body):
    print(f"📤 Sending reply to {to_email}...")

    msg = EmailMessage()
    msg["Subject"] = f"Re: {subject}"
    msg["From"] = EMAIL
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
            smtp.starttls(context=ssl.create_default_context())
            smtp.login(EMAIL, PASSWORD)
            smtp.send_message(msg)
            print("✅ Reply sent!")
    except Exception as e:
        print("❌ Failed to send email:", e)


if __name__ == "__main__":
    print("💡 Email bot started.")
    check_and_reply_to_emails()
