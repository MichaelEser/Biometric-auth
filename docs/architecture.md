# Architecture Overview

## System diagram
(Add diagram here)

## Request flow — Login with facial verification
1. User submits email + password + webcam frame
2. FastAPI verifies credentials (bcrypt)
3. FacePipeline runs: preprocess → RetinaFace detect → Silent-Face liveness → ArcFace embed
4. pgvector cosine similarity query against stored embedding
5. If score ≥ threshold → issue JWT access + refresh tokens
6. Frontend stores tokens, redirects to /dashboard

## Components
- **Backend**: FastAPI + PostgreSQL (pgvector) + Redis
- **AI**: InsightFace (ArcFace + RetinaFace ONNX) + Silent-Face
- **Frontend**: React + TypeScript + TailwindCSS + react-webcam
- **Infra**: Docker + GitHub Actions
