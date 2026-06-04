import numpy as np
from insightface.app import FaceAnalysis

_detector = None

def get_detector():
    global _detector
    if _detector is None:
        _detector = FaceAnalysis(
            name="buffalo_l",
            allowed_modules=["detection"],
            providers=["CPUExecutionProvider"]
        )
        _detector.prepare(ctx_id=0, det_size=(640, 640))
    return _detector

def detect_faces(image: np.ndarray) -> list:
    detector = get_detector()
    faces = detector.get(image)
    if len(faces) == 0:
        raise ValueError("No face detected in image")
    if len(faces) > 1:
        raise ValueError("Multiple faces detected, please ensure only one face is visible")
    return faces

def get_primary_face(image: np.ndarray):
    faces = detect_faces(image)
    return faces[0]
