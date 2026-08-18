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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome back,{" "}
              <span className="gradient-text">{user?.username}</span>
            </h1>
            <p className="text-white/40 mt-1">
              You are securely authenticated using facial recognition
            </p>
          </div>

          {/* Status card */}
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Authentication Status</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                  <p className="text-green-400 text-sm">Biometrically verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* User info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="glass rounded-2xl p-5 glass-hover">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Username</p>
              <p className="text-white font-medium">{user?.username}</p>
            </div>
            <div className="glass rounded-2xl p-5 glass-hover">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
            <div className="glass rounded-2xl p-5 glass-hover">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Account Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-green-400 font-medium">Active</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-5 glass-hover">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-white font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) : "—"}
              </p>
            </div>
          </div>

          {/* Tech stack */}
          <div className="glass rounded-2xl p-6">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Powered by</p>
            <div className="flex flex-wrap gap-2">
              {["ArcFace", "RetinaFace", "pgvector", "FastAPI", "React", "Redis"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}