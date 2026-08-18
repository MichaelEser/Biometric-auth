import numpy as np
from app.ml.preprocessing.image_utils import decode_base64_image, to_rgb
from app.ml.detection.retinaface import get_primary_face
from app.ml.embedding.arcface import extract_embedding
from app.ml.anti_spoof.silent_face import is_live
from app.core.config import settings
from app.core.exceptions import NoFaceDetectedError, MultipleFacesError, LivenessError


def run_enroll(image_b64: str) -> np.ndarray:
    """
    Run the full enrollment pipeline on a base64 encoded image.
    
    Steps:
        1. Decode base64 image
        2. Convert BGR to RGB
        3. Detect face using RetinaFace
        4. Check liveness using Silent-Face
        5. Extract 512-dim embedding using ArcFace
    
    Args:
        image_b64: Base64 encoded JPEG image string
        
    Returns:
        np.ndarray: Normalized 512-dimensional face embedding
        
    Raises:
        NoFaceDetectedError: If no face is found in the image
        MultipleFacesError: If more than one face is detected
        LivenessError: If the liveness check fails
    """
    image = decode_base64_image(image_b64)
    image_rgb = to_rgb(image)

    try:
        face = get_primary_face(image_rgb)
    except ValueError as e:
        if "No face" in str(e):
            raise NoFaceDetectedError()
        if "Multiple" in str(e):
            raise MultipleFacesError()
        raise

    bbox = face.bbox.tolist()

    if not is_live(image_rgb, bbox):
        raise LivenessError()

    embedding = extract_embedding(image_rgb)
    return embedding


def run_verify(image_b64: str, stored_embedding: np.ndarray) -> tuple[bool, float]:
    """
    Run the full verification pipeline on a base64 encoded image.
    
    Steps:
        1. Decode base64 image
        2. Convert BGR to RGB
        3. Detect face using RetinaFace
        4. Check liveness using Silent-Face
        5. Extract 512-dim embedding using ArcFace
        6. Compute cosine similarity against stored embedding
    
    Args:
        image_b64: Base64 encoded JPEG image string
        stored_embedding: The stored 512-dim embedding to compare against
        
    Returns:
        tuple[bool, float]: (authenticated, similarity_score)
        
    Raises:
        NoFaceDetectedError: If no face is found in the image
        MultipleFacesError: If more than one face is detected
        LivenessError: If the liveness check fails
    """
    image = decode_base64_image(image_b64)
    image_rgb = to_rgb(image)

    try:
        face = get_primary_face(image_rgb)
    except ValueError as e:
        if "No face" in str(e):
            raise NoFaceDetectedError()
        if "Multiple" in str(e):
            raise MultipleFacesError()
        raise

    bbox = face.bbox.tolist()

    if not is_live(image_rgb, bbox):
        raise LivenessError()

    live_embedding = extract_embedding(image_rgb)
    similarity = float(np.dot(live_embedding, stored_embedding))
    authenticated = similarity >= settings.SIMILARITY_THRESHOLD

    return authenticated, similarity