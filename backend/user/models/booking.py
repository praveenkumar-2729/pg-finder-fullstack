from sqlalchemy import Column, Integer, String, Date, ForeignKey
from database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    pg_id = Column(Integer, ForeignKey("pgs.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("pg_rooms.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)

    user_name = Column(String, nullable=False)
    user_email = Column(String, nullable=False)
    user_phone = Column(String, nullable=False)

    move_in_date = Column(Date, nullable=False)
    move_out_date = Column(Date, nullable=True)

    user_type = Column(String, nullable=False)
    college_name = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    native_place = Column(String, nullable=True)

    beds_booked = Column(Integer, nullable=False)

    owner_email = Column(String, nullable=False)
    status = Column(String, default="CONFIRMED")

