from pydantic import BaseModel
from typing import Dict, Optional

from pydantic import BaseModel, EmailStr
from typing import Optional

class PGCreate(BaseModel):
    name: str
    location: str
    exact_location: str
    owner_name: str
    contact: str
    email: Optional[EmailStr] = None
    owner_id: int
    gender: str 

    class Config:
        from_attributes = True

class PGUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    exact_location: Optional[str] = None
    owner_name: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[EmailStr] = None
    gender: Optional[str] = None 

    class Config:
        from_attributes = True


class PGResponse(BaseModel):
    id: int
    name: str
    location: str
    exact_location: str
    owner_name: str
    contact: str
    email: Optional[str]
    admin_status: str
    gender: str 

    class Config:
        orm_mode = True
