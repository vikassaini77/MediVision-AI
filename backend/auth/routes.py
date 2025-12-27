from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.auth.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(user: dict):
    if users_collection.find_one({"email": user["email"]}):
        raise HTTPException(400, "User already exists")

    user["hashed_password"] = hash_password(user["password"])
    user.pop("password")
    users_collection.insert_one(user)
    return {"message": "Account created. Please verify email."}

@router.post("/login")
def login(data: dict):
    user = users_collection.find_one({"email": data["email"]})
    if not user or not verify_password(data["password"], user["hashed_password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}
