from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

# GET  /users/me
# PATCH /users/me
