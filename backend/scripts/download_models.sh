#!/bin/bash
# Download ONNX model weights into backend/onnx_models/
# Run this once after cloning the repo.
#
# Models needed:
#   - ArcFace R100 (buffalo_l from InsightFace)
#   - RetinaFace (included in buffalo_l pack)
#   - Silent-Face anti-spoof (download from GitHub release)
echo "Downloading models..."
# Add your download commands here
echo "Done. Models saved to backend/onnx_models/"
