from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from owner.schemas.pg import PGUpdate
from database import SessionLocal
from owner.models.pg import PG
from auth.models.account import Account  
from owner.models.pg_room import PGRoom


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


@router.get("/my-pgs/{owner_id}")
def my_pgs(owner_id: int, db: Session = Depends(get_db)):

    owner = db.query(Account).filter(Account.id == owner_id).first()

    if not owner or owner.role != "owner":
        raise HTTPException(status_code=403)

    pgs = db.query(PG).filter(PG.owner_id == owner.id).all()

    return {
        "pgs": pgs
    }

@router.get("/pgs/{pg_id}")
def get_single_pg(pg_id: int, db: Session = Depends(get_db)):
    pg = db.query(PG).filter(PG.id == pg_id).first()

    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")

    return pg


# delete logic

@router.delete("/delete-pg/{pg_id}")
def delete_pg(pg_id: int, db: Session = Depends(get_db)):

    pg = db.query(PG).filter(PG.id == pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")

    db.delete(pg)
    db.commit()

    return {"message": "PG deleted successfully"}

# update logic

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

    db.commit()
    db.refresh(pg)

    return {"message": "PG updated successfully"}


@router.get("/pg/{pg_id}/rooms")
def get_rooms_of_pg(pg_id: int, db: Session = Depends(get_db)):

    rooms = db.query(PGRoom).filter(PGRoom.pg_id == pg_id).all()

    return {"rooms": rooms}
