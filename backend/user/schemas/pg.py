from pydantic import BaseModel
from typing import List, Optional
from user.schemas.pg_room import PGRoomResponse


class PGPreviewResponse(BaseModel):
    id: int
    name: str
    location: str

    model_config = {
        "from_attributes": True
    }


class PGWithRooms(BaseModel):
    id: int
    name: str
    location: str
    exact_location: Optional[str] = None
    owner_name: Optional[str] = None
    gender: Optional[str] = None
    mess_available: Optional[bool] = None
    rooms: List[PGRoomResponse]

    model_config = {
        "from_attributes": True
    }

