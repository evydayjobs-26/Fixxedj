from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import create_access_token, create_refresh_token
from app.services.otp import generate_otp, send_otp_sms

router = APIRouter()


@router.post("/send-otp")
async def send_otp(phone: str, db: AsyncSession = Depends(get_db)):
    """Generate and send a 6-digit OTP to the given phone number."""
    otp = generate_otp()
    await send_otp_sms(phone, otp)
    # TODO: store hashed OTP in Redis with TTL
    return {"message": "OTP sent"}


@router.post("/verify-otp")
async def verify_otp(phone: str, otp: str, db: AsyncSession = Depends(get_db)):
    """Verify the OTP and return JWT tokens."""
    # TODO: look up and validate OTP from Redis
    # Placeholder – always succeeds in dev
    access = create_access_token(subject=phone)
    refresh = create_refresh_token(subject=phone)
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Exchange a refresh token for a new access token."""
    from app.core.security import decode_token
    from jose import JWTError

    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        access = create_access_token(subject=payload["sub"])
        return {"access_token": access, "token_type": "bearer"}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.post("/token")
async def token_login(phone: str, db: AsyncSession = Depends(get_db)):
    """OAuth2 password-flow compatible endpoint (dev shortcut)."""
    access = create_access_token(subject=phone)
    return {"access_token": access, "token_type": "bearer"}
