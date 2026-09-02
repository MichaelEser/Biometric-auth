from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.api.routes.biometric import verify
from app.domain.biometric.schemas import VerifyRequest


@pytest.mark.asyncio
async def test_verify_endpoint_returns_unauthorized_for_face_mismatch():
    payload = VerifyRequest(image_b64="a" * 100)
    current_user = SimpleNamespace(id=uuid4())

    with (
        patch(
            "app.api.routes.biometric.verify_face",
            new=AsyncMock(
                return_value={"authenticated": False, "similarity_score": 0.31}
            ),
        ),
        pytest.raises(HTTPException) as exc_info,
    ):
        await verify(payload, current_user, object())

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Face verification failed"
