from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from owner.models.pg import PG
from owner.models.pg_room import PGRoom
from owner.schemas.pg_room import PGRoomCreate, PGRoomUpdate, PGRoomResponse

router = APIRouter(
    prefix="/pgowner",
    tags=["Owner-Room"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/pg/{pg_id}/rooms", response_model=PGRoomResponse)
def add_room(pg_id: int, data: PGRoomCreate, db: Session = Depends(get_db)):


    # Check if PG exists
    pg = db.query(PG).filter(PG.id == pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")

    # 🔥 TEMPORARY RULE (for development)
    # Allow rooms when status = pending or approved
    # Block only if rejected
    if pg.admin_status == "rejected":
        raise HTTPException(
            status_code=400,
            detail="Your PG was rejected by admin — cannot add rooms"
        )

    new_room = PGRoom(
        pg_id=pg_id,
        sharing=data.sharing,
        ac=data.ac,
        beds_available=data.beds_available,
        booked_beds=0,
        rent_per_bed=data.rent_per_bed,
        attached_bathroom=data.attached_bathroom,
        food=data.food,
        wifi=data.wifi,
        laundry=data.laundry,
        parking=data.parking,
        housekeeping=data.housekeeping,
        cctv_24_7=data.cctv_24_7,
        security_guard=data.security_guard
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room


@router.put("/update-room/{room_id}", response_model=PGRoomResponse)
def update_room(room_id: int, data: PGRoomUpdate, db: Session = Depends(get_db)):

    room = db.query(PGRoom).filter(PGRoom.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(room, key, value)

    db.commit()
    db.refresh(room)

    return room

@router.get("/pg/{pg_id}/rooms")
def get_rooms_of_pg(pg_id: int, db: Session = Depends(get_db)):
    rooms = db.query(PGRoom).filter(PGRoom.pg_id == pg_id).all()

    return {
        "total_rooms": len(rooms),
        "rooms": rooms
    }

@router.delete("/delete-room/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(PGRoom).filter(PGRoom.id == room_id).first()

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    db.delete(room)
    db.commit()

    return {"message": "Room deleted successfully"}
