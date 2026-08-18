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
    setStep("face");
  }

  async function handleCapture(imageB64: string) {
    setCaptureStatus("scanning");
    setError("");
    try {
      await register(email, username, password, imageB64);
      setCaptureStatus("success");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      setCaptureStatus("error");
      setError(err.response?.data?.detail || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      {/* Background glow effects */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-400/10 border border-green-400/20 mb-4">
            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-white/40 text-sm mt-1">Register your face to get started</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step === "form" ? "bg-green-400" : "bg-green-400"}`} />
          <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step === "face" ? "bg-green-400" : "bg-white/10"}`} />
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 slide-up">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 
                    focus:outline-none focus:border-green-400/50 transition-all duration-200 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 
                    focus:outline-none focus:border-green-400/50 transition-all duration-200 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 
                    focus:outline-none focus:border-green-400/50 transition-all duration-200 text-sm"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-sm mt-2
                  bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900
                  hover:from-green-300 hover:to-emerald-400 hover:shadow-lg hover:shadow-green-400/25
                  transition-all duration-300 active:scale-95"
              >
                Continue to Face Scan
              </button>

              <p className="text-center text-sm text-white/30">
                Already have an account?{" "}
                <Link to="/login" className="text-green-400 hover:text-green-300 transition-colors">
                  Login
                </Link>
              </p>
            </form>
          )}

          {step === "face" && (
            <div className="flex flex-col items-center gap-4 slide-up">
              <div className="text-center mb-2">
                <p className="text-white font-medium">Face Enrollment</p>
                <p className="text-white/40 text-sm mt-1">We'll use this to verify your identity</p>
              </div>
              <FaceCapture onCapture={handleCapture} status={captureStatus} />
              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              <button
                onClick={() => { setStep("form"); setCaptureStatus("idle"); setError(""); }}
                className="text-white/30 text-sm hover:text-white/60 transition-colors"
              >
                ← Back to details
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Your biometric data is encrypted and stored securely
        </p>
      </div>
    </div>
  );
}