from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from database import SessionLocal
from owner.models.pg import PG
from owner.models.pg_room import PGRoom
from user.schemas.pg import PGPreviewResponse, PGWithRooms

router = APIRouter(prefix="/user/pgs", tags=["User PG"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------
# 1️⃣ DASHBOARD PREVIEW (3 PGs - BASIC)
# ----------------------------
@router.get("/preview", response_model=List[PGPreviewResponse])
def preview_pgs(db: Session = Depends(get_db)):
    pgs = (
        db.query(PG)
        .filter(PG.admin_status.in_(["approved", "pending"]))
        .limit(3)
        .all()
    )

    return pgs


# ----------------------------
# 2️⃣ ALL PG LIST (FULL DATA FOR FILTERING)
# ----------------------------
@router.get("", response_model=List[PGWithRooms])
def all_pgs(db: Session = Depends(get_db)):

    pgs = (
        db.query(PG)
        .options(joinedload(PG.rooms))  # 🔥 automatically loads rooms
        .filter(PG.admin_status.in_(["approved", "pending"]))
        .all()
    )

    return pgs


# ----------------------------
# 3️⃣ PG DETAIL + ROOMS
# ----------------------------
@router.get("/{pg_id}", response_model=PGWithRooms)
def get_pg_detail(pg_id: int, db: Session = Depends(get_db)):

    pg = (
        db.query(PG)
        .options(joinedload(PG.rooms))
        .filter(PG.id == pg_id)
        .filter(PG.admin_status.in_(["approved", "pending"]))
        .first()
    )

    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")

    return pg
