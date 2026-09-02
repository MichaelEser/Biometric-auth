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
3. Frontend sends credentials and the base64 face image to `POST /auth/register`
4. Backend runs FacePipeline:
   - Decodes base64 image
   - RetinaFace detects face and landmarks
   - The liveness hook runs (currently a development placeholder)
   - ArcFace extracts 512-dim embedding
5. Backend atomically stores the user and embedding in PostgreSQL
6. JWT tokens are issued only after the transaction succeeds
7. User redirected to dashboard

## Request Flow — Login

1. User enters email + password
2. User captures face via webcam
3. Frontend sends credentials and the base64 face image to `POST /auth/login`
4. Backend verifies the password with bcrypt
5. Backend runs FacePipeline on the live image
6. The live embedding is compared with that user's stored embedding
7. If similarity meets `SIMILARITY_THRESHOLD`, JWT access and refresh tokens are issued
8. A mismatch returns `401 Unauthorized` without issuing any tokens
9. User redirected to dashboard

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

### Production limitation

`app/ml/anti_spoof/silent_face.py` currently returns a perfect liveness score for
every detected face. A tested anti-spoofing model must replace this placeholder
before production use; otherwise printed photos and screen replays are not blocked.
