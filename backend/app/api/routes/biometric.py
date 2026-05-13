from fastapi import APIRouter

router = APIRouter(prefix="/biometric", tags=["biometric"])

# POST /biometric/enroll   — detect face, extract embedding, store in pgvector
# POST /biometric/verify   — compare live embedding to stored, return similarity score
