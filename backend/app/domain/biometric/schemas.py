import base64
import binascii

from pydantic import BaseModel, field_validator


def validate_image_b64(value: str) -> str:
    if len(value) < 100:
        raise ValueError("Image data too short")
    if len(value) > 10_000_000:
        raise ValueError("Image data too large")
    try:
        base64.b64decode(value, validate=True)
    except (binascii.Error, ValueError):
        raise ValueError("Invalid base64 image data") from None
    return value


class EnrollRequest(BaseModel):
    image_b64: str

    @field_validator("image_b64")
    @classmethod
    def validate_image(cls, v: str) -> str:
        return validate_image_b64(v)


class VerifyRequest(BaseModel):
    image_b64: str

    @field_validator("image_b64")
    @classmethod
    def validate_image(cls, v: str) -> str:
        return validate_image_b64(v)


class VerifyResponse(BaseModel):
    authenticated: bool
    similarity_score: float
