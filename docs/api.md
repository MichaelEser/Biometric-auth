# API reference

FastAPI exposes interactive OpenAPI documentation at
<http://localhost:8000/docs> while the backend is running.

All face images are sent as base64-encoded JPEG data without the
`data:image/jpeg;base64,` prefix.

## Authentication

### `POST /auth/register`

Creates a user and biometric template in one database transaction. Tokens are
returned only after face processing and enrollment succeed.

```json
{
  "email": "user@example.com",
  "username": "myusername",
  "password": "mypassword123",
  "image_b64": "<base64 JPEG>"
}
```

Successful response (`201 Created`):

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### `POST /auth/login`

Verifies the password and face before issuing tokens.

```json
{
  "email": "user@example.com",
  "password": "mypassword123",
  "image_b64": "<base64 JPEG>"
}
```

A password or face mismatch returns `401 Unauthorized` without tokens.

### `POST /auth/token/refresh`

Issues a new token pair from a valid refresh token.

```json
{
  "refresh_token": "eyJ..."
}
```

### `POST /auth/logout`

Revokes the presented access token in Redis.

```http
Authorization: Bearer <access_token>
```

## Users

### `GET /users/me`

Returns the authenticated user.

```http
Authorization: Bearer <access_token>
```

```json
{
  "id": "8b98a91f-5a3d-4eaa-9c17-a67156a37fd1",
  "email": "user@example.com",
  "username": "myusername",
  "is_active": true,
  "created_at": "2026-09-05T12:00:00"
}
```

## Biometric operations

These endpoints require an access token.

### `POST /biometric/enroll`

Replaces the authenticated user's existing face template after the new capture
has been processed successfully.

```json
{
  "image_b64": "<base64 JPEG>"
}
```

### `POST /biometric/verify`

Verifies a capture against the authenticated user's stored template.

```json
{
  "image_b64": "<base64 JPEG>"
}
```

Successful response (`200 OK`):

```json
{
  "authenticated": true,
  "similarity_score": 0.7342
}
```

A mismatch returns `401 Unauthorized`.

## Common errors

| Status | Meaning |
|---|---|
| `400` | Invalid image, missing enrollment, or invalid registration data |
| `401` | Invalid/revoked token or failed credentials/face match |
| `422` | Request schema validation failed |
| `429` | Authentication rate limit exceeded |
