# Architecture Overview

## System Architecture
Browser (React + TailwindCSS)
|
| HTTPS
v
Nginx (Frontend)
|
| /api/* proxy
v
FastAPI (Backend)
| |
| v
| Redis
| (JWT blacklist
| + rate limiting)
v
PostgreSQL + pgvector
(users + face embeddings)

## Request Flow — Registration

1. User fills form (email, username, password)
2. User captures face via webcam
3. Frontend sends credentials to `POST /auth/register`
4. Backend hashes password with bcrypt, creates user in PostgreSQL
5. Frontend sends base64 face image to `POST /biometric/enroll`
6. Backend runs FacePipeline:
   - Decodes base64 image
   - RetinaFace detects face and landmarks
   - Silent-Face checks liveness
   - ArcFace extracts 512-dim embedding
7. Embedding stored in pgvector
8. User redirected to dashboard

## Request Flow — Login

1. User enters email + password
2. User captures face via webcam
3. Frontend sends credentials to `POST /auth/login`
4. Backend verifies password with bcrypt
5. Frontend sends face image to `POST /biometric/verify`
6. Backend runs FacePipeline on live image
7. pgvector cosine similarity query against stored embedding
8. If similarity ≥ 0.45 → authenticated
9. JWT access token (15min) + refresh token (7d) issued
10. User redirected to dashboard

## Components

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React + TypeScript + TailwindCSS | UI and webcam capture |
| Backend | FastAPI | REST API and business logic |
| AI Engine | InsightFace (ArcFace + RetinaFace) | Face detection and embedding |
| Database | PostgreSQL + pgvector | User data and face embeddings |
| Cache | Redis | JWT blacklist and rate limiting |
| Proxy | Nginx | Serve frontend and proxy API |

## Security

- Passwords hashed with bcrypt
- JWT tokens with short expiry (15 min)
- Refresh token rotation
- JWT blacklisting on logout via Redis
- Rate limiting on auth endpoints (5 req/min)
- Input validation on all endpoints via Pydantic
- Biometric templates stored as normalized vectors