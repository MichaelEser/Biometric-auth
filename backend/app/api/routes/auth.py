from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.domain.auth.schemas import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
from app.domain.auth.service import register_user, login_user, refresh_tokens
from app.core.security import verify_token
from app.services.rate_limiter import rate_limit

bearer_scheme = HTTPBearer()

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: Request, payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    await rate_limit(request, limit=5, window=60)
    try:
        user = await register_user(db, payload.email, payload.username, payload.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return await login_user(db, payload.email, payload.password)

@router.post("/login", response_model=TokenResponse)
async def login(request: Request, payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    await rate_limit(request, limit=5, window=60)
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

@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    token = credentials.credentials
    try:
        payload = verify_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    from app.core.redis import blacklist_token
    from app.core.config import settings
    await blacklist_token(payload["jti"], settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return {"message": "Logged out successfully"}