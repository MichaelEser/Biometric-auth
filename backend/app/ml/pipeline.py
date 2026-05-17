# FacePipeline — single entry point for all biometric operations
#
# run_enroll(image_b64):
#   1. decode + preprocess image
#   2. detect face (RetinaFace)
#   3. check liveness (Silent-Face)
#   4. align face crop
#   5. extract embedding (ArcFace)
#   6. return embedding vector
#
# run_verify(image_b64, stored_embedding):
#   1–5. same as enroll
#   6. compute cosine similarity
#   7. return (authenticated: bool, score: float)
import numpy as np
from app.ml.preprocessing.image_utils import decode_base64_image, to_rgb
from app.ml.detection.retinaface import get_primary_face
from app.ml.embedding.arcface import extract_embedding
from app.ml.anti_spoof.silent_face import is_live
from app.core.config import settings

def run_enroll(image_b64: str) -> np.ndarray:
    image = decode_base64_image(image_b64)
    image_rgb = to_rgb(image)

    face = get_primary_face(image_rgb)
    bbox = face.bbox.tolist()

    if not is_live(image, bbox):
        raise ValueError("Liveness check failed - spoof attempt detected")
    
    embedding = extract_embedding(image_rgb)
    return embedding

def run_verify(image_b64: str, stored_embedding: np.ndarray) -> tuple[bool, float]:
    image = decode_base64_image(image_b64)
    image_rgb = to_rgb(image)

    face = get_primary_face(image_rgb)
    bbox = face.bbox.tolist()

    if not is_live(image, bbox):
        raise ValueError("Liveness check failed - spoof attempt detected")
    
    live_embedding = extract_embedding(image_rgb)

    similarity = float(np.dot(live_embedding, stored_embedding))
    authenticated = similarity >= settings.SIMILARITY_THRESHOLD

    return authenticated, similarity
