# Pydantic models:
#   UserCreate, UserRead, UserUpdate
from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}