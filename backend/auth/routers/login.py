from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from auth.models.account import Account
from auth.schemas.account import LoginSchema

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):

    acc = db.query(Account).filter(
        Account.email == data.email,
        Account.password == data.password
    ).first()

    if not acc:
        raise HTTPException(401, "Invalid credentials")

    return {
        "id": acc.id,
        "role": acc.role,
        "name":acc.name
    }
