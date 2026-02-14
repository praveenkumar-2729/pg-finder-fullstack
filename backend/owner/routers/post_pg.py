from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from owner.models.pg import PG
from auth.models.account import Account
from owner.schemas.pg import PGCreate,PGUpdate
from utils.email_utils import send_email

router = APIRouter(
    prefix="/pgowner",
    tags=["Owner"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register-pg")
def register_pg(data: PGCreate, db: Session = Depends(get_db)):

    # 🔐 Verify owner
    owner = db.query(Account).filter(Account.id == data.owner_id).first()

    if not owner or owner.role != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")

    new_pg = PG(
        name=data.name,
        location=data.location,
        exact_location=data.exact_location,
        owner_name=data.owner_name,
        contact=data.contact,
        email=data.email,
        gender=data.gender,    
        owner_id=owner.id,
        admin_status="pending"
    )

    db.add(new_pg)
    db.commit()
    db.refresh(new_pg)

    send_email(
        to_email=owner.email,
        subject="PG Registration Submitted",
        html_content=f"""
        <h2>PG Finder 🎉</h2>
        <p>Hi <b>{owner.name}</b>,</p>
        <p>Your PG <b>{new_pg.name}</b> is registered.</p>
        <p>Status: <b>Pending Admin Approval</b></p>
        """
    )

    return {
        "message": "PG registered successfully.",
        "pg_id": new_pg.id,
        "status": "Success"
    }


@router.put("/update-pg/{pg_id}")
def update_pg(pg_id: int, data: PGUpdate, db: Session = Depends(get_db)):

    pg = db.query(PG).filter(PG.id == pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")

    if data.name is not None:
        pg.name = data.name

    if data.location is not None:
        pg.location = data.location

    if data.exact_location is not None:
        pg.exact_location = data.exact_location

    if data.owner_name is not None:
        pg.owner_name = data.owner_name

    if data.contact is not None:
        pg.contact = data.contact

    if data.email is not None:
        pg.email = data.email

    if data.gender is not None:         
        pg.gender = data.gender

    db.commit()
    db.refresh(pg)

    return {"message": "PG updated successfully"}

