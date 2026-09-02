import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaceCapture } from "../components/biometric/FaceCapture";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"form" | "face">("form");
  const [captureStatus, setCaptureStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("face");
  }

  async function handleCapture(imageB64: string) {
    setCaptureStatus("scanning");
    setError("");
    try {
      await login(email, password, imageB64);
      setCaptureStatus("success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err: any) {
      setCaptureStatus("error");
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : Array.isArray(detail) ? detail[0]?.msg || "Validation error" : "Login failed");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>

      {/* Left side — branding */}
      <div style={{ display: "none" }} className="md:flex flex-col gap-4 mr-16 max-w-sm">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>BiometricAuth</span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>
          Secure login with your face
        </h2>
        <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
          No passwords needed. Just look at the camera and you're in.
        </p>
      </div>

      {/* Card */}
      <div className="card fade-in" style={{ width: "100%", maxWidth: 420, padding: 40 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>BiometricAuth</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
            {step === "form" ? "Sign in" : "Face verification"}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {step === "form" ? "Enter your credentials to continue" : "Look directly at the camera"}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#2563eb" }} />
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: step === "face" ? "#2563eb" : "#e2e8f0", transition: "background 0.4s" }} />
        </div>

        {step === "form" && (
          <form onSubmit={handleFormSubmit} className="slide-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
              Continue to Face Scan →
            </button>

            <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
              No account?{" "}
              <Link to="/register" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                Create one
              </Link>
            </p>
          </form>
        )}

        {step === "face" && (
          <div className="slide-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <FaceCapture onCapture={handleCapture} status={captureStatus} />
            {error && (
              <div style={{ width: "100%", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>{error}</p>
              </div>
            )}
            <button
              onClick={() => { setStep("form"); setCaptureStatus("idle"); setError(""); }}
              style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}
            >
              ← Back to credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
}