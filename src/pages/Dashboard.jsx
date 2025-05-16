// src/pages/Dashboard.jsx

import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

function Dashboard({ isSidebarOpen, setIsSidebarOpen }) {
  const auth = useAuth();
  const userName = auth.user?.profile?.email || "User";

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please login to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="container mx-auto px-4 py-8">
          <Toaster position="top-center" />

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600">
              Welcome, {userName.split("@")[0]} 🚀
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage your security posture across all domains
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
