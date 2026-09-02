import React, { useState } from "react";
import Webcam from "react-webcam";
import { useWebcam } from "../../hooks/useWebcam";

interface FaceCaptureProps {
  onCapture: (imageB64: string) => void;
  status: "idle" | "scanning" | "success" | "error";
}

export function FaceCapture({ onCapture, status }: FaceCaptureProps) {
  const { webcamRef, streamReady, captureFrame, onUserMedia, onUserMediaError } = useWebcam();
  const [camError, setCamError] = useState(false);

  function handleCapture() {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot({
      width: 640,
      height: 480,
    });
    if (!screenshot) {
      alert("Could not capture image. Please allow camera access and try again.");
      return;
    }
    const base64 = screenshot.split(",")[1];
    if (!base64) {
      alert("Image encoding failed. Please try again.");
      return;
    }
    onCapture(base64);
  }

  const borderColor = {
    idle: "#e2e8f0",
    scanning: "#3b82f6",
    success: "#22c55e",
    error: "#ef4444",
  }[status];

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>

      {/* Oval camera container */}
      <div style={{ position: "relative", width: 280, height: 340 }}>

        {/* Oval clipped webcam */}
        <div style={{
          width: 280,
          height: 340,
          borderRadius: "50%",
          overflow: "hidden",
          background: "#0f172a",
          position: "absolute",
          top: 0,
          left: 0,
        }}>
          {camError ? (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "#94a3b8", gap: 8,
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p style={{ fontSize: 12, textAlign: "center", padding: "0 16px" }}>
                Camera access denied. Please allow camera permissions.
              </p>
            </div>
          ) : (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={{
                facingMode: "user",
              }}
              onUserMedia={onUserMedia}
              onUserMediaError={() => {
                onUserMediaError();
                setCamError(true);
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          {/* Scanning line — clipped inside oval */}
          {status === "scanning" && (
            <div style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.9), transparent)",
              animation: "scanLine 1.8s ease-in-out infinite",
              pointerEvents: "none",
            }} />
          )}

          {/* Success overlay */}
          {status === "success" && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(34,197,94,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="34" stroke="#22c55e" strokeWidth="3" fill="rgba(34,197,94,0.15)" />
                <path d="M22 36l10 10 18-18" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Oval SVG border */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          width="280"
          height="340"
          viewBox="0 0 280 340"
        >
          <ellipse
            cx="140" cy="170" rx="136" ry="166"
            fill="none"
            stroke={borderColor}
            strokeWidth="3"
            strokeDasharray={status === "scanning" ? "20 8" : "0"}
            style={{
              transition: "stroke 0.4s ease",
              transformOrigin: "140px 170px",
              animation: status === "scanning" ? "rotateDash 2s linear infinite" : "none",
            }}
          />

          {/* Corner accent dots */}
          {status !== "success" && (
            <>
              <circle cx="140" cy="4" r="4" fill={borderColor} style={{ transition: "fill 0.4s" }} />
              <circle cx="140" cy="336" r="4" fill={borderColor} style={{ transition: "fill 0.4s" }} />
              <circle cx="4" cy="170" r="4" fill={borderColor} style={{ transition: "fill 0.4s" }} />
              <circle cx="276" cy="170" r="4" fill={borderColor} style={{ transition: "fill 0.4s" }} />
            </>
          )}
        </svg>

        {/* Face landmark dots — scanning only */}
        {status === "scanning" && (
          <svg
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            width="280"
            height="340"
            viewBox="0 0 280 340"
          >
            {[
              { cx: 105, cy: 148, dur: "1s", delay: "0s" },
              { cx: 175, cy: 148, dur: "1s", delay: "0.3s" },
              { cx: 140, cy: 188, dur: "1.2s", delay: "0.15s" },
              { cx: 118, cy: 218, dur: "0.9s", delay: "0.1s" },
              { cx: 162, cy: 218, dur: "0.9s", delay: "0.25s" },
              { cx: 110, cy: 118, dur: "1.4s", delay: "0.05s" },
              { cx: 170, cy: 118, dur: "1.4s", delay: "0.2s" },
              { cx: 140, cy: 108, dur: "1.1s", delay: "0.35s" },
            ].map((dot, i) => (
              <circle key={i} cx={dot.cx} cy={dot.cy} r="2.5" fill="#3b82f6">
                <animate
                  attributeName="opacity"
                  values="0.9;0.2;0.9"
                  dur={dot.dur}
                  begin={dot.delay}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        )}
      </div>

      {/* Status text */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {status === "scanning" && (
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#3b82f6",
                animation: `bounceDot 1s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <p style={{ color: statusColor, fontSize: 14, fontWeight: 500, transition: "color 0.3s" }}>
          {statusText}
        </p>
      </div>

      {/* Capture button */}
      <button
        onClick={handleCapture}
        disabled={!streamReady || camError || status === "scanning" || status === "success"}
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
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes scanLine {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}