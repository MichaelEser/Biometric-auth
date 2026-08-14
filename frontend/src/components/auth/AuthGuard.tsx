// Route wrapper — reads auth state from Zustand store
// Redirects unauthenticated users to /login
// Shows loading spinner while auth state is initializing
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "guest") {
      navigate("/login");
    }
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (status === "guest") {
    return null;
  }

  return <>{children}</>;
}