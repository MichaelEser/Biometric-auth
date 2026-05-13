# JWT creation, decoding, and verification
# Password hashing and verification using bcrypt
from app.utils.hashing import hash_password, verify_password
from app.utils.tokens import (
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_jti
)

def get_password_hash(plain: str) -> str:
    return hash_password(plain)

def check_password(plain: str, hashed: str) -> bool:
    return verify_password(plain, hashed)

def issue_tokens(user_id: str) -> dict:
    jti_access = generate_jti()
    jti_refresh = generate_jti()
    return {
        "access_token": create_access_token(user_id, jti_access),
        "refresh_token": create_refresh_token(user_id, jti_refresh),
        "token_type": "bearer"
    }

def verify_token(token: str) -> dict:
    return decode_token(token)