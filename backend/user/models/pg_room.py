from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base
from sqlalchemy.orm import relationship


class PGRoom(Base):
    __tablename__ = "pg_rooms"

    id = Column(Integer, primary_key=True, index=True)

    pg_id = Column(Integer, ForeignKey("pgs.id"), nullable=False)

    sharing = Column(Integer, nullable=False)
    ac = Column(Boolean, nullable=False)
    beds_available = Column(Integer, nullable=False)
    booked_beds = Column(Integer, default=0)

    rent_per_bed = Column(Integer, nullable=False)
    attached_bathroom = Column(Boolean, nullable=False)

    food = Column(String, nullable=False)

    wifi = Column(String, default="Not mentioned")
    laundry = Column(String, default="Not mentioned")
    parking = Column(String, default="Not mentioned")
    housekeeping = Column(String, default="Not mentioned")
    cctv_24_7 = Column(String, default="Not mentioned")
    security_guard = Column(String, default="Not mentioned")
    pg = relationship("PG", back_populates="rooms")


