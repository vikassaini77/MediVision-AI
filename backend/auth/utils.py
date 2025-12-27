from fastapi import HTTPException, status
from jose import jwt, JWTError
from datetime import datetime
import os


JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"


def normalize_email(email: str) -> str:
    """
    Normalize email for consistent storage & lookup
    """
    return email.strip().lower()


def decode_token(token: str) -> dict:
    """
    Decode and validate JWT token
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def get_current_user_email(token: str) -> str:
    """
    Extract user email from JWT token
    """
    payload = decode_token(token)
    email: str = payload.get("sub")

    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

    return email


def current_utc_time() -> datetime:
    return datetime.utcnow()
