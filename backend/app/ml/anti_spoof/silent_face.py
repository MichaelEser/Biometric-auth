# Silent-Face anti-spoofing model wrapper
# check_liveness(image, bbox) -> float (liveness score 0.0–1.0)
# Score below 0.5 = likely spoof (printed photo / replay attack)
import numpy as np

def check_liveness(image: np.ndarray, bbox: list) -> float:
    """
    Placeholder for Silent-Face anti-spoofing model.
    Returns a liveness score between 0.0 and 1.0.
    Score above 0.5 = real face, below 0.5 = spoof.
    
    The real Silent-Face model will be integrated in Phase 5.
    For now returns 1.0 to allow development to continue.
    """
    return 1.0

def is_live(image: np.ndarray, bbox: list, threshold: float = 0.5) -> bool:
    score = check_liveness(image, bbox)
    return score >= threshold
