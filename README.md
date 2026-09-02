# AI-Powered Biometric Authentication System

A full-stack web application for facial registration and verification with a secure JWT-based backend.

## Stack
| Layer | Technology |
|---|---|
| Backend | FastAPI + PostgreSQL (pgvector) + Redis |
| AI / CV | InsightFace (ArcFace + RetinaFace); Silent-Face integration pending |
| Frontend | React + TypeScript + TailwindCSS + react-webcam |
| Infra | Docker + GitHub Actions |

## Features
- Face registration via webcam
- Facial verification on login
- JWT access + refresh token system
- Redis JWT blacklisting on logout
- Rate limiting on auth endpoints
- pgvector cosine similarity search

## Quick Start

```bash
# 1. Copy and fill environment variables
cp .env.example .env

# 2. Download AI model weights
bash backend/scripts/download_models.sh

# 3. Start all services
docker-compose up --build

# 4. Apply database migrations
docker-compose exec backend alembic upgrade head
```

- Backend API docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Live Demo

- **Frontend**: https://biometric-auth-frontend.onrender.com
- **Backend API docs**: https://biometric-auth-backend-enwe.onrender.com/docs

## How It Works

1. Register with email, username, password, and a face scan
2. Login with credentials and a live face scan
3. The system compares your live face embedding against the stored one using cosine similarity
4. If the similarity score meets `SIMILARITY_THRESHOLD`, the backend issues JWT tokens

> [!WARNING]
> The current `silent_face.py` implementation is a development placeholder that
> always accepts liveness. Do not treat this project as production-ready until a
> tested anti-spoofing model is integrated and calibrated for the deployment cameras.

## Project Structurebiometric-auth/
├── backend/ # FastAPI backend
│ ├── app/
│ │ ├── api/ # HTTP routes
│ │ ├── core/ # Config, security, Redis
│ │ ├── domain/ # Auth, users, biometric logic
│ │ └── ml/ # AI pipeline
│ └── migrations/ # Alembic migrations
├── frontend/ # React frontend
│ └── src/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ └── store/
└── docker/ # Nginx config

## Deployment
See `docker-compose.prod.yml` for production configuration.
Set all environment variables from `.env.example` in your deployment platform.
