# Custom exception classes and global exception handlers
#
# BiometricEnrollError   — face not detected or embedding failed
# BiometricVerifyError   — similarity below threshold
# TokenExpiredError      — JWT expired
# RateLimitError         — too many requests
from fastapi import Request
from fastapi.responses import JSONResponse

class BiometricError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class NoFaceDetectedError(BiometricError):
    def __init__(self):
        super().__init__("No face detected in image. Please ensure your face is clearly visible.")

class MultipleFacesError(BiometricError):
    def __init__(self):
        super().__init__("Multiple faces detected. Please ensure only one face is visible.")

class LivenessError(BiometricError):
    def __init__(self):
        super().__init__("Liveness check failed. Please use a real face, not a photo.")

class SimilarityError(BiometricError):
    def __init__(self):
        super().__init__("Face not recognized. Please try again.")

async def biometric_exception_handler(request: Request, exc: BiometricError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )