# POST /auth/register
# POST /auth/login
# POST /auth/logout
# POST /auth/token/refresh

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.domain.auth.schemas import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
from app.domain.auth.service import register_user, login_user, refresh_tokens

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    try:
        user = await register_user(db, payload.email, payload.username, payload.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return await login_user(db, payload.email, payload.password)

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    try:
        return await login_user(db, payload.email, payload.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post("/token/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest):
    try:
        return await refresh_tokens(payload.refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))