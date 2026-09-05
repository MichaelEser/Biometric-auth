import base64

import cv2
import numpy as np


def decode_base64_image(image_b64: str) -> np.ndarray:
    image_data = base64.b64decode(image_b64)
    np_array = np.frombuffer(image_data, dtype=np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode image")
    return image


def to_rgb(image: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
