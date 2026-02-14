from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from auth.models.account import Account   
from auth.schemas.account import RegisterSchema  

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):

    exists = db.query(Account).filter(Account.email == data.email).first()
    if exists:
        raise HTTPException(400, "Email already exists")


    acc = Account(
        name=data.name,
        email=data.email,
        password=data.password,
        role=data.role
    )

    db.add(acc)
    db.commit()
    db.refresh(acc)

    return {"message": "Registered successfully"}
