import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* Navbar */}
      <nav style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1024,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#2563eb",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>BiometricAuth</span>
          </Link>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* User badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
                {user?.username}
              </span>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#22c55e",
              }} />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: "white",
                fontSize: 13,
                fontWeight: 500,
                color: "#64748b",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "#fef2f2";
                (e.target as HTMLButtonElement).style.borderColor = "#fecaca";
                (e.target as HTMLButtonElement).style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "white";
                (e.target as HTMLButtonElement).style.borderColor = "#e2e8f0";
                (e.target as HTMLButtonElement).style.color = "#64748b";
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: 1024, margin: "0 auto", padding: "40px 24px" }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #e2e8f0",
        padding: "20px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 12, color: "#94a3b8" }}>
          BiometricAuth — Powered by ArcFace + pgvector
        </p>
      </footer>
    </div>
  );
}