# Biometric business logic:
#   enroll()   — run ML pipeline, store embedding via repository
#   verify()   — run ML pipeline, query pgvector, return similarity result
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.biometric.repository import (
    save_embedding,
    get_embedding_by_user_id,
    delete_embedding
)
from app.ml.pipeline import run_enroll, run_verify
from uuid import UUID
import numpy as np

async def enroll_face(db: AsyncSession, user_id: UUID, image_b64: str) -> dict:
    existing = await get_embedding_by_user_id(db, user_id)
    if existing:
        await delete_embedding(db, user_id)

    embedding = run_enroll(image_b64)
    await save_embedding(db, user_id, embedding)
    return {"message": "Face enrolled successfully"}

async def verify_face(db: AsyncSession, user_id: UUID, image_b64: str) -> dict:
    template = await get_embedding_by_user_id(db, user_id)
    if not template:
        raise ValueError("No face enrolled for this user")

    stored_embedding = np.array(template.embedding)
    authenticated, similarity = run_verify(image_b64, stored_embedding)

    return {
        "authenticated": authenticated,
        "similarity_score": round(similarity, 4)
    }