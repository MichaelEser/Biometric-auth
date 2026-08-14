// Protected page — only accessible with a valid JWT (wrapped in AuthGuard)
// Shows: user info, last login time, session details, logout button
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { AuthGuard } from "../components/auth/AuthGuard";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, status } = useAuth();

  return (
    <AuthGuard>
      <Layout>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500 mb-6">
            You are securely authenticated using facial recognition.
          </p>

          {user && (
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Username</span>
                <span className="text-gray-800 font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Email</span>
                <span className="text-gray-800 font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Account status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Member since</span>
                <span className="text-gray-800 font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}