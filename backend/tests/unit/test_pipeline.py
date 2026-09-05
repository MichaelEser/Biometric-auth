from unittest.mock import patch

import numpy as np
from app.core.config import settings
from app.ml.pipeline import run_verify


def test_run_verify_accepts_similarity_at_threshold(monkeypatch):
    live_embedding = np.array([1.0, 0.0])
    stored_embedding = np.array([0.5, np.sqrt(0.75)])
    monkeypatch.setattr(settings, "SIMILARITY_THRESHOLD", 0.5)

    with patch("app.ml.pipeline._detect_and_embed", return_value=live_embedding):
        authenticated, similarity = run_verify("image", stored_embedding)

    assert authenticated is True
    assert similarity == 0.5


def test_run_verify_rejects_similarity_below_threshold(monkeypatch):
    live_embedding = np.array([1.0, 0.0])
    stored_embedding = np.array([0.49, np.sqrt(1 - 0.49**2)])
    monkeypatch.setattr(settings, "SIMILARITY_THRESHOLD", 0.5)

    with patch("app.ml.pipeline._detect_and_embed", return_value=live_embedding):
        authenticated, similarity = run_verify("image", stored_embedding)

    assert authenticated is False
    assert similarity == 0.49
