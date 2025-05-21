// src/pages/Dashboard.jsx

import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

function Dashboard({ isSidebarOpen, setIsSidebarOpen }) {
  const auth = useAuth();
  const userName = auth.user?.profile?.email?.split('@')[0] || "User";
  const domain = auth.user?.profile?.email?.split('@')[1] || "domain.com";

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your security dashboard...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to access the security dashboard.</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
          >
            Login Now
          </button>
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
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#fff',
                color: '#333',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6',
                padding: '16px',
                borderRadius: '10px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Welcome Section */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl px-6 py-8 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Welcome, {userName} 🚀
                  </h1>
                  <div className="flex items-center mt-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                    <p className="text-blue-100">
                      Monitoring security for <span className="font-medium">{domain}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-white/10 text-white text-sm px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
                    Last scan: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
