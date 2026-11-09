"""Celery background task definitions."""
from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "fixxedj",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)


@celery_app.task(name="tasks.expire_otp")
def expire_otp(phone: str) -> None:
    """Remove an OTP from Redis after TTL (called by schedule or direct)."""
    import redis as redis_lib

    r = redis_lib.from_url(settings.REDIS_URL)
    r.delete(f"otp:{phone}")


@celery_app.task(name="tasks.send_booking_reminders")
def send_booking_reminders() -> None:
    """Send push reminders for bookings scheduled within the next hour."""
    # TODO: query DB for upcoming bookings and call notifications service
    pass


@celery_app.task(name="tasks.update_provider_ratings")
def update_provider_ratings(provider_id: str) -> None:
    """Recompute average rating for a provider after a new review."""
    # TODO: aggregate reviews and update provider.rating
    pass


@celery_app.task(name="tasks.process_payout")
def process_payout(worker_id: str, amount: float) -> None:
    """Trigger a Stripe payout to a worker's bank account."""
    # TODO: implement Stripe Connect payout
    pass
