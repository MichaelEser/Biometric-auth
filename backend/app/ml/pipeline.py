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
