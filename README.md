# Biometric Authentication

[![CI](https://github.com/MichaelEser/Biometric-auth/actions/workflows/ci.yml/badge.svg)](https://github.com/MichaelEser/Biometric-auth/actions/workflows/ci.yml)

A full-stack facial-authentication demo built with FastAPI, React, InsightFace,
PostgreSQL/pgvector, and Redis. Registration stores a normalized face embedding;
login requires both the account password and a matching face before the backend
issues JWTs.

> [!IMPORTANT]
> This is a portfolio/demo project, not a production identity system. The liveness
> hook is currently a documented placeholder and does not block photos or screen
> replays. See [Limitations](#limitations).

## Highlights

- Password and face verification enforced together by the backend
- ArcFace embeddings and cosine-similarity matching
- Atomic user registration and biometric enrollment
- Short-lived access tokens, refresh tokens, logout revocation, and rate limiting
- PostgreSQL with pgvector for biometric templates
- React webcam flow with guarded authenticated routes
- Docker Compose development environment and GitHub Actions CI

## Technology

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Zustand |
| Backend | FastAPI, SQLAlchemy, Alembic |
| Face pipeline | InsightFace `buffalo_l` (detection + ArcFace recognition) |
| Data | PostgreSQL, pgvector, Redis |
| Infrastructure | Docker Compose, Nginx, GitHub Actions |

## Authentication flow

1. The user submits a password and webcam capture together.
2. The backend validates the password and extracts a normalized face embedding.
3. Login compares that embedding with the template stored for the requested user.
4. JWT access and refresh tokens are issued only when both checks succeed.

More detail is available in [docs/architecture.md](docs/architecture.md).

## Run locally

### Requirements

- Docker Desktop with Docker Compose
- A webcam-enabled browser

### Setup

```bash
git clone https://github.com/MichaelEser/Biometric-auth.git
cd Biometric-auth
cp .env.example .env
docker compose up --build -d
docker compose exec backend alembic upgrade head
```

Then open:

- Frontend: <http://localhost:3000>
- API documentation: <http://localhost:8000/docs>

The first face operation can take longer while InsightFace initializes its model.
Stop the project with `docker compose down`.

## Configuration

The root `.env.example` contains every required setting.

| Variable | Purpose | Example/default |
|---|---|---|
| `POSTGRES_USER` | Local database user | `user` |
| `POSTGRES_PASSWORD` | Local database password | Development value only |
| `POSTGRES_DB` | Local database name | `biometric_db` |
| `DATABASE_URL` | Async SQLAlchemy connection string | PostgreSQL container URL |
| `SECRET_KEY` | JWT signing key | Replace with a random secret |
| `REDIS_URL` | Revocation and rate-limit store | Redis container URL |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access-token lifetime | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh-token lifetime | `7` |
| `SIMILARITY_THRESHOLD` | Minimum cosine similarity for a match | `0.50` |

Face thresholds must be calibrated against representative genuine and impostor
captures. Higher values are stricter; values close to `1.0` are usually too strict
for separate webcam captures.

## Tests and checks

Backend:

```bash
ruff check backend/app backend/tests
ruff format --check backend/app backend/tests
pytest backend/tests -q
```

Frontend:

```bash
npm --prefix frontend ci
npm --prefix frontend run build
```

The same checks run in `.github/workflows/ci.yml`.

## Project layout

```text
backend/
  app/
    api/          FastAPI routes and dependencies
    core/         Configuration, security, Redis, exceptions
    domain/       Auth, users, and biometric persistence/services
    ml/           InsightFace pipeline and liveness hook
  migrations/     Alembic database migration
  tests/          Backend regression and unit tests
frontend/
  src/            React application, API client, state, and webcam UI
docker/
  nginx/          Frontend server and API reverse proxy
docs/             API and architecture notes
```

## Documentation

- [API reference](docs/api.md)
- [Architecture](docs/architecture.md)
- Interactive OpenAPI documentation at `/docs` while the backend is running

## Limitations

- `backend/app/ml/anti_spoof/silent_face.py` currently returns a successful
  liveness score for every detected face. A tested anti-spoofing model is required
  before real-world use.
- Biometric templates are stored as embeddings, but production deployments would
  also require encryption/key management, audit logging, retention policies, and
  privacy/legal review.
- The default threshold is a development starting point, not a universal security
  guarantee.
