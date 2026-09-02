import base64
import binascii

from pydantic import BaseModel, EmailStr, field_validator


def validate_image_b64(value: str) -> str:
    if len(value) < 100:
        raise ValueError("Image data too short")
    try:
        base64.b64decode(value, validate=True)
    except (binascii.Error, ValueError):
        raise ValueError("Invalid base64 image data")
    return value


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    image_b64: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        if len(v) > 30:
            raise ValueError("Username must be at most 30 characters")
        if not v.isalnum():
            raise ValueError("Username must only contain letters and numbers")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if len(v) > 72:
            raise ValueError("Password must be at most 72 characters")
        return v

    @field_validator("image_b64")
    @classmethod
    def image_valid(cls, v: str) -> str:
        return validate_image_b64(v)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    image_b64: str

    @field_validator("image_b64")
    @classmethod
    def image_valid(cls, v: str) -> str:
        return validate_image_b64(v)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class RefreshRequest(BaseModel):
    refresh_token: str
