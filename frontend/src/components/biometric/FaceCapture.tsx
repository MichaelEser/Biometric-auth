// react-webcam wrapper component
// Props: onCapture(imageB64: string), status: "idle"|"scanning"|"success"|"fail"
// Shows: live webcam feed, capture button, status overlay, liveness indicator
import React from "react";
import Webcam from "react-webcam";
import { useWebcam } from "../../hooks/useWebcam";

interface FaceCaptureProps {
  onCapture: (imageB64: string) => void;
  status: "idle" | "scanning" | "success" | "error";
}

export function FaceCapture({ onCapture, status }: FaceCaptureProps) {
  const { webcamRef, streamReady, captureFrame, onUserMedia, onUserMediaError } = useWebcam();

  function handleCapture() {
    const frame = captureFrame();
    if (frame) {
      const base64 = frame.split(",")[1];
      onCapture(base64);
    }
  }

  const borderColor = {
    idle: "border-gray-400",
    scanning: "border-yellow-400",
    success: "border-green-500",
    error: "border-red-500",
  }[status];

  const statusText = {
    idle: "Position your face in the frame",
    scanning: "Scanning...",
    success: "Face captured successfully",
    error: "Face not recognized, try again",
  }[status];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`border-4 rounded-lg overflow-hidden ${borderColor}`}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
        />
      </div>
      <p className="text-sm text-gray-600">{statusText}</p>
      <button
        onClick={handleCapture}
        disabled={!streamReady || status === "scanning"}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
      >
        Capture Face
      </button>
    </div>
  );
}