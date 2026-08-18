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
    """
    Enroll a user's face by extracting and storing their embedding.
    
    If the user already has a face enrolled, it will be replaced
    with the new one.
    
    Args:
        db: Async database session
        user_id: UUID of the user to enroll
        image_b64: Base64 encoded JPEG face image
        
    Returns:
        dict: Success message
        
    Raises:
        NoFaceDetectedError: If no face is found in the image
        MultipleFacesError: If more than one face is detected
        LivenessError: If the liveness check fails
    """
    existing = await get_embedding_by_user_id(db, user_id)
    if existing:
        await delete_embedding(db, user_id)

    embedding = run_enroll(image_b64)
    await save_embedding(db, user_id, embedding)
    return {"message": "Face enrolled successfully"}


async def verify_face(db: AsyncSession, user_id: UUID, image_b64: str) -> dict:
    """
    Verify a live face against the user's stored embedding.
    
    Args:
        db: Async database session
        user_id: UUID of the user to verify
        image_b64: Base64 encoded JPEG face image
        
    Returns:
        dict: authenticated (bool) and similarity_score (float)
        
    Raises:
        ValueError: If no face is enrolled for the user
        NoFaceDetectedError: If no face is found in the image
        MultipleFacesError: If more than one face is detected
        LivenessError: If the liveness check fails
    """
    template = await get_embedding_by_user_id(db, user_id)
    if not template:
        raise ValueError("No face enrolled for this user")

    stored_embedding = np.array(template.embedding)
    authenticated, similarity = run_verify(image_b64, stored_embedding)

    return {
        "authenticated": authenticated,
        "similarity_score": round(similarity, 4)
    }