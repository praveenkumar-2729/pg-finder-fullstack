from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class PG(Base):
    __tablename__ = "pgs"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    exact_location = Column(String, nullable=False)

    owner_name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    email = Column(String, nullable=True)

    gender = Column(String, nullable=False)   

    admin_status = Column(String, default="pending")

    owner_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    
    rooms = relationship("PGRoom", back_populates="pg", cascade="all, delete")
