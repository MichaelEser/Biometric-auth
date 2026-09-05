import numpy as np


def check_liveness(_image: np.ndarray, _bbox: list) -> float:
    """Development placeholder; replace with a tested anti-spoofing model."""
    return 1.0


def is_live(image: np.ndarray, bbox: list, threshold: float = 0.5) -> bool:
    score = check_liveness(image, bbox)
    return score >= threshold
