from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# Properties shared by all user schemas
class UserBase(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    specialization: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False


# Properties received on user creation
class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str


# Properties to receive via API for updating a user
class UserUpdate(UserBase):
    password: Optional[str] = None


# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Properties to return to client
class User(UserInDBBase):
    pass


# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str