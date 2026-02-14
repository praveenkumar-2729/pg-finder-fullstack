from pydantic import BaseModel, EmailStr, validator
from datetime import date
from typing import Optional

class BookingCreate(BaseModel):
    pg_id: int
    room_id: int
    user_id: int

    user_name: str
    user_email: EmailStr
    user_phone: str

    move_in_date: date
    move_out_date: Optional[date] = None

    user_type: str   # "student" | "employee" | "other"

    college_name: Optional[str] = None
    company_name: Optional[str] = None
    native_place: Optional[str] = None      # ✅ ADD THIS

    beds_booked: int


    # -------- VALIDATIONS --------

    @validator("beds_booked")
    def validate_beds(cls, v):
        if v <= 0:
            raise ValueError("Beds booked must be at least 1")
        return v

    @validator("user_type")
    def validate_user_type(cls, v):
        allowed = ["student", "employee", "other"]
        if v not in allowed:
            raise ValueError(f"user_type must be one of {allowed}")
        return v

    @validator("college_name", always=True)
    def check_college_for_student(cls, v, values):
        if values.get("user_type") == "student" and not v:
            raise ValueError("college_name is required for students")
        return v

    @validator("company_name", always=True)
    def check_company_for_employee(cls, v, values):
        if values.get("user_type") == "employee" and not v:
            raise ValueError("company_name is required for employees")
        return v

    @validator("move_out_date")
    def validate_dates(cls, v, values):
        if v and v < values.get("move_in_date"):
            raise ValueError("move_out_date cannot be before move_in_date")
        return v
    @validator("native_place", always=True)
    def check_native_for_other(cls, v, values):
        if values.get("user_type") == "other" and not v:
            raise ValueError("native_place is required for user_type='other'")
        return v
