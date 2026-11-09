from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/create-intent")
async def create_payment_intent(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe PaymentIntent for a booking."""
    import stripe
    from app.core.config import settings
    from sqlalchemy import select
    from app.models.booking import Booking
    from uuid import UUID

    stripe.api_key = settings.STRIPE_SECRET_KEY

    result = await db.execute(select(Booking).where(Booking.id == UUID(booking_id)))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Amount in cents (paise for INR)
    intent = stripe.PaymentIntent.create(
        amount=int(booking.total_amount * 100),
        currency="inr",
        metadata={"booking_id": booking_id},
    )
    return {"client_secret": intent.client_secret}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Stripe webhook events."""
    import stripe
    from app.core.config import settings

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Handle the event
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        # TODO: mark booking as paid
        pass

    return {"received": True}


@router.get("/")
async def list_payments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List payments for the current user."""
    from sqlalchemy import select
    from app.models.payment import Payment

    result = await db.execute(
        select(Payment).where(Payment.payer_id == current_user.id)
    )
    return result.scalars().all()
