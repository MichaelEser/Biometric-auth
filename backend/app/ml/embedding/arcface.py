# Thin compatibility wrapper — see app.ml.model. Prefer calling
# app.ml.model.analyze_primary_face() directly and reading `.embedding`
# off the returned Face; calling extract_embedding() on its own re-runs
# face detection.
import numpy as np
from app.ml.model import get_face_app


def get_embedder():
    return get_face_app()


def extract_embedding(image: np.ndarray) -> np.ndarray:
    faces = get_face_app().get(image)
    if len(faces) == 0:
        raise ValueError("No face detected for embedding extraction")
    embedding = faces[0].embedding
    return embedding / np.linalg.norm(embedding)
