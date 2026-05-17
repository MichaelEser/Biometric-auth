# Database queries for biometric templates:
#   save_embedding()
#   get_embedding_by_user_id()
#   delete_embedding()
#   find_nearest_embedding()  — pgvector cosine similarity query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.domain.biometric.models import BiometricTemplate
from uuid import UUID
import numpy as np

async def save_embedding(db: AsyncSession, user_id: UUID, embedding: np.ndarray) -> BiometricTemplate:
    template = BiometricTemplate(
        user_id=user_id,
        embedding=embedding.tolist()
    )
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template

async def get_embedding_by_user_id(db: AsyncSession, user_id: UUID) -> BiometricTemplate | None:
    result = await db.execute(
        select(BiometricTemplate).where(BiometricTemplate.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def delete_embedding(db: AsyncSession, user_id: UUID) -> None:
    template = await get_embedding_by_user_id(db, user_id)
    if template:
        await db.delete(template)
        await db.commit()

async def find_nearest_embedding(db: AsyncSession, embedding: np.ndarray, threshold: float = 0.45) -> BiometricTemplate | None:
    from sqlalchemy import text
    embedding_list = embedding.tolist()
    result = await db.execute(
        text("""
            SELECT id, user_id, embedding, created_at
            FROM biometric_templates
            ORDER BY embedding <=> CAST(:embedding AS vector)
            LIMIT 1
        """),
        {"embedding": str(embedding_list)}
    )
    row = result.fetchone()
    if row is None:
        return None
    similarity = float(np.dot(embedding, np.array(row.embedding)))
    if similarity < threshold:
        return None
    return await get_embedding_by_user_id(db, row.user_id)