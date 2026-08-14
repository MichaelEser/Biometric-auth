from pydantic import BaseModel, field_validator
import base64

class EnrollRequest(BaseModel):
    image_b64: str

    @field_validator("image_b64")
    @classmethod
    def validate_image(cls, v: str) -> str:
        if len(v) < 100:
            raise ValueError("Image data too short")
        try:
            base64.b64decode(v, validate=True)
        except Exception:
            raise ValueError("Invalid base64 image data")
        return v

class VerifyRequest(BaseModel):
    image_b64: str

    @field_validator("image_b64")
    @classmethod
    def validate_image(cls, v: str) -> str:
        if len(v) < 100:
            raise ValueError("Image data too short")
        try:
            base64.b64decode(v, validate=True)
        except Exception:
            raise ValueError("Invalid base64 image data")
        return v

class VerifyResponse(BaseModel):
    authenticated: bool
    similarity_score: float