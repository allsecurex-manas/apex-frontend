// src/pages/Dashboard.jsx

import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

function Dashboard() {
  const auth = useAuth();
  const userName = auth.user?.profile?.email || "User";

  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <div>Please login to access the dashboard.</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 ml-64 p-6">
        <Toaster position="top-center" />

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Welcome, {userName.split("@")[0]} 🚀
        </h1>

        {/* This is where sub-pages will render */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
