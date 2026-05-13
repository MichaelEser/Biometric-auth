# API Reference

Full interactive docs available at http://localhost:8000/docs (FastAPI auto-generated)

## Auth
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/token/refresh

## Users
- GET  /users/me
- PATCH /users/me

## Biometric
- POST /biometric/enroll
- POST /biometric/verify
