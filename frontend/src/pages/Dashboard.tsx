import React from "react";
import { Layout } from "../components/layout/Layout";
import { AuthGuard } from "../components/auth/AuthGuard";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <Layout>
        <div className="fade-in">

          {/* Welcome header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
              Welcome back, {user?.username} 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: 15 }}>
              You're securely authenticated using facial recognition.
            </p>
          </div>

          {/* Status banner */}
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#dcfce7",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "#15803d", fontSize: 14 }}>Identity Verified</p>
              <p style={{ color: "#16a34a", fontSize: 13 }}>Biometric authentication successful</p>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Username", value: user?.username, icon: "👤" },
              { label: "Email", value: user?.email, icon: "✉️" },
              { label: "Status", value: "Active", icon: "✅" },
              { label: "Member Since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—", icon: "📅" },
            ].map((item) => (
              <div key={item.label} className="card" style={{ padding: 20 }}>
                <p style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</p>
                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Tech stack card */}
          <div className="card" style={{ padding: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
              Powered By
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { name: "ArcFace", color: "#eff6ff", text: "#2563eb" },
                { name: "RetinaFace", color: "#eff6ff", text: "#2563eb" },
                { name: "pgvector", color: "#f0fdf4", text: "#16a34a" },
                { name: "FastAPI", color: "#fff7ed", text: "#ea580c" },
                { name: "React", color: "#f0f9ff", text: "#0284c7" },
                { name: "Redis", color: "#fef2f2", text: "#dc2626" },
              ].map((tech) => (
                <span key={tech.name} style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: tech.color,
                  color: tech.text,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </Layout>
    </AuthGuard>
  );
}