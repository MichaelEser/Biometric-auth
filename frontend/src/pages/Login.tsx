// Login flow:
// 1. Enter email + password
// 2. Live webcam scan
// 3. Submit to /auth/login + /biometric/verify
// On success: store tokens, redirect to /dashboard
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
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      setCaptureStatus("error");
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h1>

        {step === "form" && (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
            <p className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        )}

        {step === "face" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 text-sm text-center">
              Scan your face to complete login
            </p>
            <FaceCapture onCapture={handleCapture} status={captureStatus} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}