# pytest fixtures shared across all tests:
#   db_session   — isolated async test DB session
#   client       — async TestClient for FastAPI
#   test_user    — a seeded User record
#   auth_headers — Authorization header with valid JWT
