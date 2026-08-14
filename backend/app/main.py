from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, biometric
from app.core.logging import setup_logging
from app.db.init_db import init_db
from app.core.exceptions import BiometricError, biometric_exception_handler

app = FastAPI(
    title="Biometric Auth API",
    description="Facial authentication system using ArcFace + pgvector",
    version="0.1.0",
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.add_exception_handler(BiometricError, biometric_exception_handler)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(biometric.router)

@app.on_event("startup")
async def startup():
    setup_logging()
    await init_db()