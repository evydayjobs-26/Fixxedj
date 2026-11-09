"""Push notification stubs – swap in Firebase FCM or Expo Push later."""
from __future__ import annotations

import httpx


async def send_push_notification(
    expo_push_token: str,
    title: str,
    body: str,
    data: dict | None = None,
) -> bool:
    """Send a push notification via Expo Push Notification service."""
    payload = {
        "to": expo_push_token,
        "title": title,
        "body": body,
        "data": data or {},
        "sound": "default",
    }
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://exp.host/--/api/v2/push/send",
                json=payload,
                headers={"Accept": "application/json", "Content-Type": "application/json"},
                timeout=10,
            )
        return resp.status_code == 200
    except Exception as exc:
        print(f"[NOTIFY] Failed to send push: {exc}")
        return False


async def notify_booking_accepted(worker_expo_token: str, booking_id: str) -> bool:
    return await send_push_notification(
        worker_expo_token,
        title="New Job Request",
        body="You have a new booking request. Tap to view details.",
        data={"bookingId": booking_id, "type": "BOOKING_ACCEPTED"},
    )


async def notify_worker_en_route(customer_expo_token: str, worker_name: str) -> bool:
    return await send_push_notification(
        customer_expo_token,
        title="Worker On the Way",
        body=f"{worker_name} is heading to your location.",
        data={"type": "WORKER_EN_ROUTE"},
    )


async def notify_booking_completed(customer_expo_token: str, booking_id: str) -> bool:
    return await send_push_notification(
        customer_expo_token,
        title="Job Completed",
        body="Your service has been completed. Please leave a review!",
        data={"bookingId": booking_id, "type": "BOOKING_COMPLETED"},
    )
