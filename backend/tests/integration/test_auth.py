from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest

from app.domain.auth.service import login_user


@pytest.mark.asyncio
async def test_login_rejects_face_mismatch_without_issuing_tokens():
    user = SimpleNamespace(
        id=uuid4(),
        hashed_password="hashed-password",
        is_active=True,
    )

    with (
        patch(
            "app.domain.auth.service.get_user_for_login",
            new=AsyncMock(return_value=user),
        ),
        patch("app.domain.auth.service.check_password", return_value=True),
        patch(
            "app.domain.auth.service.verify_face",
            new=AsyncMock(
                return_value={"authenticated": False, "similarity_score": 0.31}
            ),
        ),
        patch("app.domain.auth.service.issue_tokens") as issue_tokens,
        pytest.raises(ValueError, match="Face verification failed"),
    ):
        await login_user(object(), "user@example.com", "password", "image")

    issue_tokens.assert_not_called()


@pytest.mark.asyncio
async def test_login_issues_tokens_only_after_face_match():
    user = SimpleNamespace(
        id=uuid4(),
        hashed_password="hashed-password",
        is_active=True,
    )
    expected_tokens = {
        "access_token": "access",
        "refresh_token": "refresh",
        "token_type": "bearer",
    }

    with (
        patch(
            "app.domain.auth.service.get_user_for_login",
            new=AsyncMock(return_value=user),
        ),
        patch("app.domain.auth.service.check_password", return_value=True),
        patch(
            "app.domain.auth.service.verify_face",
            new=AsyncMock(
                return_value={"authenticated": True, "similarity_score": 0.82}
            ),
        ),
        patch(
            "app.domain.auth.service.issue_tokens",
            return_value=expected_tokens,
        ) as issue_tokens,
    ):
        result = await login_user(object(), "user@example.com", "password", "image")

    assert result == expected_tokens
    issue_tokens.assert_called_once_with(str(user.id))
