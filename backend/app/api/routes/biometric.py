from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.deps import get_current_user
from app.domain.biometric.schemas import EnrollRequest, VerifyRequest, VerifyResponse
from app.domain.biometric.service import enroll_face, verify_face
from app.domain.users.models import User

router = APIRouter(prefix="/biometric", tags=["biometric"])

# POST /biometric/enroll   — detect face, extract embedding, store in pgvector
# POST /biometric/verify   — compare live embedding to stored, return similarity score

@router.post("/enroll")
async def enroll(
    payload: EnrollRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        return await enroll_face(db, current_user.id, payload.image_b64)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.post("/verify", response_model=VerifyResponse)
async def verify(
    payload: VerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        return await verify_face(db, current_user.id, payload.image_b64)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    