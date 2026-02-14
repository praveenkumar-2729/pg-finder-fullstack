from pydantic import BaseModel
from typing import Optional

class PGRoomCreate(BaseModel):
    sharing: int
    ac: bool
    beds_available: int
    rent_per_bed: int
    attached_bathroom: bool
    food: str
    wifi: Optional[str] = "Not mentioned"
    laundry: Optional[str] = "Not mentioned"
    parking: Optional[str] = "Not mentioned"
    housekeeping: Optional[str] = "Not mentioned"
    cctv_24_7: Optional[str] = "Not mentioned"
    security_guard: Optional[str] = "Not mentioned"



class PGRoomUpdate(BaseModel):
    sharing: Optional[int] = None
    ac: Optional[bool] = None
    beds_available: Optional[int] = None
    rent_per_bed: Optional[int] = None
    attached_bathroom: Optional[bool] = None
    food: Optional[str] = None

    wifi: Optional[str] = None
    laundry: Optional[str] = None
    parking: Optional[str] = None
    housekeeping: Optional[str] = None
    cctv_24_7: Optional[str] = None
    security_guard: Optional[str] = None

class PGRoomResponse(BaseModel):
    id: int
    pg_id: int
    sharing: int
    ac: bool
    beds_available: int
    booked_beds: int
    rent_per_bed: int
    attached_bathroom: bool
    food: str
    wifi: str
    laundry: str
    parking: str
    housekeeping: str
    cctv_24_7: str
    security_guard: str

    class Config:
        orm_mode = True
