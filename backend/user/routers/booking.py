from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from user.schemas.booking import BookingCreate
from user.models.booking import Booking
from owner.models.pg import PG
from owner.models.pg_room import PGRoom
from auth.models.account import Account
from utils.email_utils import send_email

router = APIRouter(prefix="/bookings", tags=["Bookings"])



@router.post("/")
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):

    # ---- Check PG ----
    pg = db.query(PG).filter(PG.id == data.pg_id).first()
    if not pg:
        raise HTTPException(status_code=404, detail="PG not found")

    # ---- Check Room ----
    room = db.query(PGRoom).filter(PGRoom.id == data.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # ---- Validate beds requested ----
    if data.beds_booked <= 0:
        raise HTTPException(status_code=400, detail="Beds booked must be at least 1")

    if room.beds_available < data.beds_booked:
        raise HTTPException(
            status_code=400,
            detail=f"Only {room.beds_available} beds available"
        )

    # ---- Get real owner email ----
    owner_account = (
        db.query(Account)
        .filter(Account.id == pg.owner_id, Account.role == "owner")
        .first()
    )

    if not owner_account:
        raise HTTPException(status_code=404, detail="Owner account not found")

    owner_email = owner_account.email

    # ---- Reduce beds correctly ----
    room.beds_available -= data.beds_booked
    room.booked_beds += data.beds_booked

    # ---- Create booking ----
    new_booking = Booking(
        pg_id=data.pg_id,
        room_id=data.room_id,
        user_id=data.user_id,

        user_name=data.user_name,
        user_email=data.user_email,
        user_phone=data.user_phone,

        move_in_date=data.move_in_date,
        move_out_date=data.move_out_date,

        user_type=data.user_type,
        college_name=data.college_name if data.user_type == "student" else None,
        company_name=data.company_name if data.user_type == "employee" else None,
        native_place=data.native_place if data.user_type == "other" else None,   

        beds_booked=data.beds_booked,

        owner_email=owner_email,
        status="CONFIRMED"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # ---- Email to owner ----
    owner_html = f"""
    <h2>New PG Booking Received</h2>
    <p><b>PG:</b> {pg.name}</p>
    <p><b>Room ID:</b> {data.room_id}</p>
    <p><b>User:</b> {data.user_name}</p>
    <p><b>Phone:</b> {data.user_phone}</p>
    <p><b>Beds Booked:</b> {data.beds_booked}</p>
    <p><b>Move-in:</b> {data.move_in_date}</p>
    <p><b>User Type:</b> {data.user_type}</p>
    """

    send_email(owner_email, "New PG Booking Received", owner_html)

    # ---- Email to user ----
    user_html = f"""
    <h2>Booking Confirmed ✅</h2>
    <p>Hi <b>{data.user_name}</b>,</p>
    <p>Your booking for <b>{pg.name}</b> is confirmed.</p>
    <p><b>Beds Booked:</b> {data.beds_booked}</p>
    <p><b>Move-in:</b> {data.move_in_date}</p>
    <p>The owner will contact you soon.</p>
    """

    send_email(data.user_email, "Your PG Booking Confirmation", user_html)

    return {
        "message": "Booking confirmed",
        "booking_id": new_booking.id,
        "remaining_beds": room.beds_available
    }



@router.get("/user/{user_email}")
def get_user_bookings(user_email: str, db: Session = Depends(get_db)):

    results = (
        db.query(
            Booking.id,
            Booking.pg_id,
            Booking.room_id,
            Booking.move_in_date,
            PG.name.label("pg_name"),
            Booking.beds_booked
        )
        .join(PG, PG.id == Booking.pg_id)
        .filter(Booking.user_email == user_email)
        .all()
    )

    bookings = []
    for r in results:
        bookings.append({
            "id": r.id,
            "pg_id": r.pg_id,
            "room_id": r.room_id,
            "pg_name": r.pg_name,
            "move_in_date": str(r.move_in_date),
            "beds_booked": r.beds_booked
        })

    return bookings



@router.post("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):

    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # ---- Restore beds correctly ----
    room = db.query(PGRoom).filter(PGRoom.id == booking.room_id).first()
    if room:
        room.beds_available += booking.beds_booked
        room.booked_beds -= booking.beds_booked

    # ---- Get PG and Owner email ----
    pg = db.query(PG).filter(PG.id == booking.pg_id).first()

    owner_account = (
        db.query(Account)
        .filter(Account.id == pg.owner_id, Account.role == "owner")
        .first()
    )

    owner_email = owner_account.email if owner_account else None

    # ---- Email to OWNER ----
    if owner_email:
        owner_html = f"""
        <h2>Booking Cancelled ❌</h2>
        <p>The following booking has been cancelled:</p>
        <p><b>PG:</b> {pg.name}</p>
        <p><b>User:</b> {booking.user_name}</p>
        <p><b>Beds Restored:</b> {booking.beds_booked}</p>
        """

        send_email(owner_email, "Booking Cancelled", owner_html)

    # ---- Email to USER ----
    user_html = f"""
    <h2>Booking Cancelled ❌</h2>
    <p>Hi <b>{booking.user_name}</b>,</p>
    <p>Your booking for <b>{pg.name}</b> has been cancelled.</p>
    """

    send_email(
        booking.user_email,
        "Your Booking Cancellation",
        user_html
    )

    # ---- Delete booking ----
    db.delete(booking)
    db.commit()

    return {
        "message": "Booking cancelled and beds restored",
        "restored_beds": room.beds_available if room else None
    }

