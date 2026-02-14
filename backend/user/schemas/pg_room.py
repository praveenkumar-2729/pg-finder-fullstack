from pydantic import BaseModel
from typing import Optional


class PGRoomResponse(BaseModel):
    id: int
    pg_id: int
    sharing: int
    beds_available: int
    rent_per_bed: int
    ac: bool
    attached_bathroom: bool
    food: str
    wifi: str
    laundry: str
    parking: str
    housekeeping: str
    cctv_24_7: str
    security_guard: str

    model_config = {
        "from_attributes": True
    }
