# Pydantic models:
#   EnrollRequest  (image: base64 str)
#   VerifyRequest  (image: base64 str)
#   VerifyResponse (authenticated: bool, similarity_score: float)

from pydantic import BaseModel

class EnrollRequest(BaseModel):
    image_b64: str

class VerifyRequest(BaseModel):
    image_b64: str

class VerifyResponse(BaseModel):
    authenticated: bool
    similarity_score: float

