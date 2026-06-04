import numpy as np
from insightface.app import FaceAnalysis

_embedder = None

def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = FaceAnalysis(
            name="buffalo_l",
            allowed_modules=["detection", "recognition"],
            providers=["CPUExecutionProvider"]
        )
        _embedder.prepare(ctx_id=0, det_size=(640, 640))
    return _embedder

def extract_embedding(image: np.ndarray) -> np.ndarray:
    embedder = get_embedder()
    faces = embedder.get(image)
    if len(faces) == 0:
        raise ValueError("No face detected for embedding extraction")
    face = faces[0]
    embedding = face.embedding
    embedding = embedding / np.linalg.norm(embedding)
    return embedding
