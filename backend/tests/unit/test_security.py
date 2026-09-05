from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from app.api.deps import get_current_user
from app.core.security import check_password, get_password_hash, issue_tokens, verify_token
from fastapi import HTTPException


def test_password_hash_round_trip():
    hashed = get_password_hash("correct horse battery staple")

    assert hashed != "correct horse battery staple"
    assert check_password("correct horse battery staple", hashed) is True
    assert check_password("wrong password", hashed) is False


def test_issued_tokens_have_expected_types():
    user_id = str(uuid4())
    tokens = issue_tokens(user_id)

    access_payload = verify_token(tokens["access_token"])
    refresh_payload = verify_token(tokens["refresh_token"])

    assert access_payload["sub"] == user_id
    assert access_payload["type"] == "access"
    assert refresh_payload["sub"] == user_id
    assert refresh_payload["type"] == "refresh"


@pytest.mark.asyncio
async def test_revoked_access_token_is_rejected():
    payload = {"sub": str(uuid4()), "jti": "revoked-token", "type": "access"}
    credentials = SimpleNamespace(credentials="token")

    with (
        patch("app.api.deps.verify_token", return_value=payload),
        patch(
            "app.api.deps.is_token_blacklisted",
            new=AsyncMock(return_value=True),
        ),
        pytest.raises(HTTPException) as exc_info,
    ):
        await get_current_user(credentials, object())

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Token revoked"
