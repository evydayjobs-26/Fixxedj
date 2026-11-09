"""OTP generation and delivery via Twilio SMS."""
import random
import string

from app.core.config import settings


def generate_otp(length: int = 6) -> str:
    """Generate a numeric OTP of the given length."""
    return "".join(random.choices(string.digits, k=length))


async def send_otp_sms(phone: str, otp: str) -> bool:
    """Send the OTP to the given phone number via Twilio.

    Returns True on success, False on failure.
    In development (no credentials), just prints the OTP.
    """
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        # Dev mode – print instead of sending
        print(f"[DEV] OTP for {phone}: {otp}")
        return True

    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Your Fixxedj verification code is: {otp}. Valid for 5 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone,
        )
        return True
    except Exception as exc:
        print(f"[ERROR] Failed to send OTP to {phone}: {exc}")
        return False
