# JWT utility functions:
#   create_access_token(user_id, jti)
#   create_refresh_token(user_id, jti)
#   decode_token(token) -> payload dict
#   generate_jti()      -> unique token ID (UUID4)

from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.core.config import settings
import uuid

def generate_jti() -> str:
    return str(uuid.uuid4())

def create_access_token(user_id: str, jti: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "jti": jti, "type": "access", "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def create_refresh_token(user_id: str, jti: str) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": user_id, "jti": jti, "type": "refresh", "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise ValueError("Invalid or expired token")
