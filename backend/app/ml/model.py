# Shared InsightFace model instance.
#
# Previously, detection (retinaface.py) and embedding (arcface.py) each
# created their own separate FaceAnalysis("buffalo_l") instance. Since the
# embedding model bundle already includes detection, this meant:
#   - the buffalo_l weights were loaded into memory twice
#   - face detection ran twice per enroll/verify request (once for the
#     bbox used by the liveness check, once again inside embedding
#     extraction)
#
# This module loads the model once and exposes a single call that returns
# both the detection bbox and the embedding together.
import numpy as np
from insightface.app import FaceAnalysis
from insightface.app.common import Face

_face_app: FaceAnalysis | None = None


def get_face_app() -> FaceAnalysis:
    global _face_app
    if _face_app is None:
        _face_app = FaceAnalysis(
            name="buffalo_l",
            allowed_modules=["detection", "recognition"],
            providers=["CPUExecutionProvider"],
        )
        _face_app.prepare(ctx_id=0, det_size=(640, 640))
    return _face_app


def analyze_primary_face(image: np.ndarray) -> Face:
    """
    Run detection + recognition in a single pass and return the one
    face present in the image (bbox and embedding already populated).

    Raises:
        ValueError: "No face detected..." or "Multiple faces detected..."
    """
    faces = get_face_app().get(image)
    if len(faces) == 0:
        raise ValueError("No face detected in image")
    if len(faces) > 1:
        raise ValueError("Multiple faces detected, please ensure only one face is visible")
    return faces[0]
