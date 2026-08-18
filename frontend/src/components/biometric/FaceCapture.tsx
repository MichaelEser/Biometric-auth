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

  const ringClass = {
    idle: "border-white/20",
    scanning: "scan-ring border-green-400",
    success: "border-green-400 glow",
    error: "border-red-400",
  }[status];

  const statusConfig = {
    idle: { text: "Position your face in the frame", color: "text-white/50", dot: "bg-white/30" },
    scanning: { text: "Scanning face...", color: "text-green-400", dot: "bg-green-400 pulse-dot" },
    success: { text: "Face verified successfully", color: "text-green-400", dot: "bg-green-400" },
    error: { text: "Face not recognized — try again", color: "text-red-400", dot: "bg-red-400" },
  }[status];

  return (
    <div className="flex flex-col items-center gap-6 fade-in">
      <div className="relative">
        <div className={`rounded-2xl overflow-hidden border-2 transition-all duration-500 ${ringClass}`}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            className="block"
            style={{ filter: status === "scanning" ? "brightness(1.1)" : "brightness(1)" }}
          />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-green-400 rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-green-400 rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-green-400 rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-green-400 rounded-br-sm" />

        {/* Scanning line */}
        {status === "scanning" && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-green-400/60"
            style={{
              animation: "scanLine 1.5s ease-in-out infinite",
              top: "50%",
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
        <p className={`text-sm font-medium ${statusConfig.color}`}>
          {statusConfig.text}
        </p>
      </div>

      <button
        onClick={handleCapture}
        disabled={!streamReady || status === "scanning"}
        className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300
          bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900
          hover:from-green-300 hover:to-emerald-400 hover:shadow-lg hover:shadow-green-400/25
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
          active:scale-95"
      >
        {status === "scanning" ? "Scanning..." : "Capture Face"}
      </button>

      <style>{`
        @keyframes scanLine {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}