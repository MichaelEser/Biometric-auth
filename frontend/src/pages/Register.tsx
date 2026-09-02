import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaceCapture } from "../components/biometric/FaceCapture";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"form" | "face">("form");
  const [captureStatus, setCaptureStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFormSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  if (password.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }
  if (username.length < 3) {
    setError("Username must be at least 3 characters");
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    setError("Username must only contain letters and numbers");
    return;
  }
  setStep("face");
}

  async function handleCapture(imageB64: string) {
    setCaptureStatus("scanning");
    setError("");
    try {
      await register(email, username, password, imageB64);
      setCaptureStatus("success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err: any) {
      setCaptureStatus("error");
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : Array.isArray(detail) ? detail[0]?.msg || "Validation error" : "Registration failed");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>

      <div className="card fade-in" style={{ width: "100%", maxWidth: 420, padding: 40 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>BiometricAuth</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
            {step === "form" ? "Create account" : "Enroll your face"}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {step === "form" ? "Fill in your details to get started" : "We'll use this to verify your identity on login"}
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
              <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>Username</label>
              <input
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Minimum 8 characters</p>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
              Continue to Face Enrollment →
            </button>

            <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                Sign in
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
              ← Back to details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}