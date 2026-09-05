import uuid
from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt

from app.core.config import settings


def generate_jti() -> str:
    return str(uuid.uuid4())


def create_access_token(user_id: str, jti: str) -> str:
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "jti": jti, "type": "access", "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def create_refresh_token(user_id: str, jti: str) -> str:
    expire = datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": user_id, "jti": jti, "type": "refresh", "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
