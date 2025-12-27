from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ======================
# REQUEST SCHEMAS
# ======================

class SignupRequest(BaseModel):
    full_name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = Field(..., examples=["Radiologist", "Physician", "Admin"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


# ======================
# RESPONSE SCHEMAS
# ======================

class MessageResponse(BaseModel):
    message: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str
    is_verified: bool
    created_at: datetime
