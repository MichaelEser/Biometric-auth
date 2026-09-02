import numpy as np
from app.ml.preprocessing.image_utils import decode_base64_image, to_rgb
from app.ml.model import analyze_primary_face
from app.ml.anti_spoof.silent_face import is_live
from app.core.config import settings
from app.core.exceptions import NoFaceDetectedError, MultipleFacesError, LivenessError


def _detect_and_embed(image_b64: str) -> np.ndarray:
    """
    Decode the image and run detection + liveness + embedding extraction.

    Detection and embedding are produced by a single model pass (see
    app.ml.model), so this does one inference call instead of two.

    Raises:
        NoFaceDetectedError: If no face is found in the image
        MultipleFacesError: If more than one face is detected
        LivenessError: If the liveness check fails
    """
    image = decode_base64_image(image_b64)
    image_rgb = to_rgb(image)

    try:
        face = analyze_primary_face(image_rgb)
    except ValueError as e:
        if "No face" in str(e):
            raise NoFaceDetectedError()
        if "Multiple" in str(e):
            raise MultipleFacesError()
        raise

    bbox = face.bbox.tolist()
    if not is_live(image_rgb, bbox):
        raise LivenessError()

    return face.embedding / np.linalg.norm(face.embedding)


def run_enroll(image_b64: str) -> np.ndarray:
    """
    Run the full enrollment pipeline on a base64 encoded image.

    Args:
        image_b64: Base64 encoded JPEG image string

    Returns:
        np.ndarray: Normalized 512-dimensional face embedding

    Raises:
        NoFaceDetectedError: If no face is found in the image
        MultipleFacesError: If more than one face is detected
        LivenessError: If the liveness check fails
    """
    return _detect_and_embed(image_b64)


def run_verify(image_b64: str, stored_embedding: np.ndarray) -> tuple[bool, float]:
    """
    Run the full verification pipeline on a base64 encoded image.

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
    live_embedding = _detect_and_embed(image_b64)
    similarity = float(np.dot(live_embedding, stored_embedding))
    authenticated = similarity >= settings.SIMILARITY_THRESHOLD
    return authenticated, similarity
