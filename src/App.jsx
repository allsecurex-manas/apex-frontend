import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Profile from "./pages/Profile";
import EmailSecurity from "./pages/EmailSecurity";
import QuantumSecurity from "./pages/QuantumSecurity";
import DNSSecurity from "./pages/DNSSecurity";
import ApplicationSecurity from "./pages/ApplicationSecurity";
import CloudSecurity from "./pages/CloudSecurity";
import ApiSecurity from "./pages/ApiSecurity";
import DataSecurity from "./pages/DataSecurity";
import NetworkSecurity from "./pages/NetworkSecurity";
import ThirdPartyRisk from "./pages/ThirdPartyRisk";
import "./App.css";

function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Simulate brief loading for smoother transitions
  useEffect(() => {
    if (!auth.isLoading) {
      const timer = setTimeout(() => {
        setAppReady(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [auth.isLoading]);

  const signOutRedirect = () => {
    const clientId = "5v74q9ljb7476b0nofe8sq23c8";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://ap-south-1eymv9kl76.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (auth.isLoading || !appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50" 
           style={{ background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)' }}>
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse opacity-40"
                 style={{ animation: 'pulse 2s infinite' }}></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"
                   style={{ animation: 'spin 1s linear infinite', borderColor: '#2563eb', borderTopColor: 'transparent' }}></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2" style={{ color: '#1e40af' }}>Loading Apex Security</h2>
          <p className="text-blue-600 text-sm" style={{ color: '#2563eb' }}>Preparing your security dashboard...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50"
           style={{ background: 'linear-gradient(to bottom right, #fef2f2, #fce7f3)' }}>
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center" 
             style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
               style={{ backgroundColor: '#fee2e2', borderRadius: '9999px', width: '5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 style={{ width: '2.5rem', height: '2.5rem', color: '#dc2626' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Authentication Error</h2>
          <p className="text-gray-600 mb-6" style={{ color: '#4b5563', marginBottom: '1.5rem' }}>{auth.error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            style={{ 
              backgroundImage: 'linear-gradient(to right, #2563eb, #4338ca)',
              color: 'white',
              padding: '0.625rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar 
        auth={auth} 
        onLogout={signOutRedirect} 
        toggleSidebar={toggleSidebar}
      />

      <main className="pt-16" style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="email-security" element={<EmailSecurity />} />
            <Route path="quantum-security" element={<QuantumSecurity />} />
            <Route path="dns-security" element={<DNSSecurity />} />
            <Route path="application-security" element={<ApplicationSecurity />} />
            <Route path="cloud-security" element={<CloudSecurity />} />
            <Route path="api-security" element={<ApiSecurity />} />
            <Route path="data-security" element={<DataSecurity />} />
            <Route path="network-security" element={<NetworkSecurity />} />
            <Route path="thirdparty-risk" element={<ThirdPartyRisk />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
