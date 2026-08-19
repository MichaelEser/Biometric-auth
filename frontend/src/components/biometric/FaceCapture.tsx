import React, { useEffect, useRef } from "react";
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

  const statusText = {
    idle: "Position your face in the oval",
    scanning: "Scanning your face...",
    success: "Face verified!",
    error: "Not recognized — try again",
  }[status];

  const statusColor = {
    idle: "#94a3b8",
    scanning: "#3b82f6",
    success: "#22c55e",
    error: "#ef4444",
  }[status];

  return (
    <div className="flex flex-col items-center gap-6 fade-in">

      {/* Camera with oval overlay */}
      <div className="relative" style={{ width: 280, height: 340 }}>

        {/* Webcam clipped to oval */}
        <div
          style={{
            width: 280,
            height: 340,
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            background: "#0f172a",
          }}
        >
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={280}
            height={340}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />

          {/* Scanning line overlay */}
          {status === "scanning" && (
            <div
              className="scanning-line"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Success overlay */}
          {status === "success" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(34,197,94,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#22c55e" strokeWidth="3" fill="rgba(34,197,94,0.1)" />
                <path d="M20 32l8 8 16-16" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Oval border — rotates when scanning */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 280,
            height: 340,
            pointerEvents: "none",
          }}
          viewBox="0 0 280 340"
        >
          <ellipse
            cx="140"
            cy="170"
            rx="136"
            ry="166"
            fill="none"
            stroke={status === "idle" ? "#e2e8f0" : statusColor}
            strokeWidth="3"
            strokeDasharray={status === "scanning" ? "30 10" : "none"}
            style={{
              transition: "stroke 0.4s ease",
              transformOrigin: "140px 170px",
              animation: status === "scanning" ? "rotateDash 1.5s linear infinite" : "none",
            }}
          />

          {/* Corner accent dots */}
          {["idle", "scanning"].includes(status) && (
            <>
              <circle cx="140" cy="4" r="4" fill={statusColor} opacity="0.8" />
              <circle cx="140" cy="336" r="4" fill={statusColor} opacity="0.8" />
              <circle cx="4" cy="170" r="4" fill={statusColor} opacity="0.8" />
              <circle cx="276" cy="170" r="4" fill={statusColor} opacity="0.8" />
            </>
          )}
        </svg>

        {/* Face landmark dots — iPhone style */}
        {status === "scanning" && (
          <svg
            style={{ position: "absolute", top: 0, left: 0, width: 280, height: 340, pointerEvents: "none" }}
            viewBox="0 0 280 340"
          >
            {/* Eye dots */}
            <circle cx="105" cy="145" r="3" fill="#3b82f6" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="175" cy="145" r="3" fill="#3b82f6" opacity="0.9">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Nose dots */}
            <circle cx="140" cy="185" r="2.5" fill="#3b82f6" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" repeatCount="indefinite" />
            </circle>
            {/* Mouth dots */}
            <circle cx="120" cy="215" r="2" fill="#3b82f6" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="160" cy="215" r="2" fill="#3b82f6" opacity="0.6">
              <animate attributeName="opacity" values="0.1;0.6;0.1" dur="0.8s" repeatCount="indefinite" />
            </circle>
            {/* Forehead dots */}
            <circle cx="140" cy="105" r="2" fill="#3b82f6" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="115" cy="115" r="2" fill="#3b82f6" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="165" cy="115" r="2" fill="#3b82f6" opacity="0.4">
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.1s" repeatCount="indefinite" />
            </circle>
          </svg>
        )}
      </div>

      {/* Status text */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {status === "scanning" && (
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    animation: `bounceDot 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
          <p style={{ color: statusColor, fontSize: 14, fontWeight: 500, transition: "color 0.3s" }}>
            {statusText}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleCapture}
        disabled={!streamReady || status === "scanning" || status === "success"}
        className="btn-primary"
        style={{ maxWidth: 280 }}
      >
        {status === "scanning" ? "Scanning..." : status === "success" ? "Verified ✓" : "Scan Face"}
      </button>

      <style>{`
        @keyframes rotateDash {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounceDot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}