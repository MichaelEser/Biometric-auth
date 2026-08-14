// Two-step registration flow:
// Step 1 — form: email, username, password
// Step 2 — face capture: open webcam, capture frame, submit
// On success: calls /auth/register then /biometric/enroll
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>

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
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        )}

        {step === "face" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 text-sm text-center">
              Now capture your face to complete registration
            </p>
            <FaceCapture onCapture={handleCapture} status={captureStatus} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}