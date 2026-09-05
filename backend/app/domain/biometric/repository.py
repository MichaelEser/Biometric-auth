from uuid import UUID

import numpy as np
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.biometric.models import BiometricTemplate


async def save_embedding(
    db: AsyncSession, user_id: UUID, embedding: np.ndarray
) -> BiometricTemplate:
    template = BiometricTemplate(user_id=user_id, embedding=embedding.tolist())
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template


async def get_embedding_by_user_id(db: AsyncSession, user_id: UUID) -> BiometricTemplate | None:
    result = await db.execute(select(BiometricTemplate).where(BiometricTemplate.user_id == user_id))
    return result.scalar_one_or_none()


async def delete_embedding(db: AsyncSession, user_id: UUID) -> None:
    template = await get_embedding_by_user_id(db, user_id)
    if template:
        await db.delete(template)
        await db.commit()
