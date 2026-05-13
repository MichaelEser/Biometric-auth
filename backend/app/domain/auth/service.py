# Auth business logic:
#   register_user()    — hash password, create user, issue tokens
#   login_user()       — verify credentials, check biometric, return tokens
#   refresh_tokens()   — validate refresh token, issue new pair
#   logout_user()      — blacklist access + refresh tokens in Redis
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.auth.repository import (
    get_user_for_login,
    register_new_user,
    user_exists
)
from app.core.security import get_password_hash, check_password, issue_tokens
from app.domain.users.models import User

async def register_user(
    db: AsyncSession,
    email: str,
    username: str,
    password: str
) -> User:
    if await user_exists(db, email, username):
        raise ValueError("Email or username already taken")
    hashed = get_password_hash(password)
    return await register_new_user(db, email, username, hashed)

async def login_user(
    db: AsyncSession,
    email: str,
    password: str
) -> dict:
    user = await get_user_for_login(db, email)
    if not user:
        raise ValueError("Invalid email or password")
    if not check_password(password, user.hashed_password):
        raise ValueError("Invalid email or password")
    if not user.is_active:
        raise ValueError("Account is disabled")
    return issue_tokens(str(user.id))

async def refresh_tokens(token: str) -> dict:
    from app.core.security import verify_token
    payload = verify_token(token)
    if payload.get("type") != "refresh":
        raise ValueError("Invalid token type")
    return issue_tokens(payload["sub"])