# Database queries for auth:
#   get_user_by_email()
#   get_user_by_username()
#   create_user()
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.users.repository import (
    get_user_by_email,
    get_user_by_username,
    create_user
)
from app.domain.users.models import User

async def get_user_for_login(db: AsyncSession, email: str) -> User | None:
    return await get_user_by_email(db, email)

async def register_new_user(
    db: AsyncSession,
    email: str,
    username: str,
    hashed_password: str
) -> User:
    return await create_user(db, email, username, hashed_password)

async def user_exists(db: AsyncSession, email: str, username: str) -> bool:
    by_email = await get_user_by_email(db, email)
    by_username = await get_user_by_username(db, username)
    return by_email is not None or by_username is not None