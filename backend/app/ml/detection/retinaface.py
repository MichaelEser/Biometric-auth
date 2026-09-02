# Thin compatibility wrapper — the model itself now lives in app.ml.model
# so detection and recognition share a single loaded FaceAnalysis instance
# instead of each loading and running their own copy of buffalo_l.
from app.ml.model import get_face_app, analyze_primary_face


def get_detector():
    return get_face_app()


def detect_faces(image) -> list:
    return [analyze_primary_face(image)]


def get_primary_face(image):
    return analyze_primary_face(image)
