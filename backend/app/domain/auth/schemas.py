# Pydantic models for auth endpoints:
#   RegisterRequest, LoginRequest
#   TokenResponse (access_token, refresh_token, token_type)
#   RefreshRequest
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshRequest(BaseModel):
    refresh_token: str