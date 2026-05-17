# OpenCV helpers for model input preparation:
#   decode_base64_image()  — base64 string -> numpy BGR array
#   align_face()           — crop and align using 5-point landmarks
#   normalize()            — scale pixel values to [0,1] or [-1,1]
#   to_rgb()               — BGR -> RGB channel swap
import cv2
import numpy as np
import base64

def decode_base64_image(image_b64: str) ->np.ndarray:
    image_data = base64.b64decode(image_b64)
    np_array = np.frombuffer(image_data, dtype=np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode image")
    return image

def to_rgb(image: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

def resize(image: np.ndarray, size: tuple = (112, 112)) -> np.ndarray:
    return cv2.resize(image, size)

def normalize(image: np.ndarray) -> np.ndarray:
    image = image.astype(np.float32)
    image = (image - 127.5) / 128.0
    return image

def preprocess_for_model(image: np.ndarray) -> np.ndarray:
    image = to_rgb(image)
    image = resize(image)
    image = normalize(image)
    image = np.transpose(image, (2,0,1))
    image = np.expand_dims(image, axis=0)
    return image