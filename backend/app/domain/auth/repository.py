# Database queries for auth:
#   get_user_by_email()
#   get_user_by_username()
#   register_new_user()
import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.biometric.models import BiometricTemplate
from app.domain.users.models import User
from app.domain.users.repository import (
    get_user_by_email,
    get_user_by_username,
)


async def get_user_for_login(db: AsyncSession, email: str) -> User | None:
    return await get_user_by_email(db, email)


async def register_new_user(
    db: AsyncSession,
    email: str,
    username: str,
    hashed_password: str,
    embedding: np.ndarray,
) -> User:
    user = User(email=email, username=username, hashed_password=hashed_password)
    db.add(user)

    try:
        # Assign the UUID without committing, then persist the account and
        # face template together so registration cannot be half-complete.
        await db.flush()
        db.add(BiometricTemplate(user_id=user.id, embedding=embedding.tolist()))
        await db.commit()
        await db.refresh(user)
    except Exception:
        await db.rollback()
        raise

    return user


async def user_exists(db: AsyncSession, email: str, username: str) -> bool:
    by_email = await get_user_by_email(db, email)
    by_username = await get_user_by_username(db, username)
    return by_email is not None or by_username is not None
