# API Reference

Full interactive docs available at:
- Local: http://localhost:8000/docs
- Production: https://biometric-auth-backend-enwe.onrender.com/docs

## Auth

### POST /auth/register
Register a new user. Returns JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "myusername",
  "password": "mypassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

---

### POST /auth/login
Login with credentials. Returns JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

---

### POST /auth/token/refresh
Get a new token pair using a refresh token.

**Request:**
```json
{
  "refresh_token": "eyJ..."
}
```

---

### POST /auth/logout
Blacklist the current access token.

**Headers:** `Authorization: Bearer <token>`

---

## Users

### GET /users/me
Get the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",