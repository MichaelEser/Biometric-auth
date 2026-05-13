# AI-Powered Biometric Authentication System

Facial registration and verification with a secure JWT-based backend.

## Stack
| Layer | Technology |
|---|---|
| Backend | FastAPI + PostgreSQL (pgvector) + Redis |
| AI / CV | InsightFace (ArcFace + RetinaFace) + Silent-Face |
| Frontend | React + TypeScript + TailwindCSS + react-webcam |
| Infra | Docker + GitHub Actions |

## Quick start

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
- Frontend:         http://localhost:3000

## Docs
See the `docs/` folder for architecture overview and API notes.
