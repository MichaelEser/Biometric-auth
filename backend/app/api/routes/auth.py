from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

# POST /auth/register
# POST /auth/login
# POST /auth/logout
# POST /auth/token/refresh
