from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    email: EmailStr
    full_name: str
    role: str
    hashed_password: str
    is_verified: bool = False
