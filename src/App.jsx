import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useState } from "react";
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

  const signOutRedirect = () => {
    const clientId = "2gnqpuoqn91kdlr71o613p6hbn";
    const logoutUri = "https://apex.allsecurex.com";
    const cognitoDomain = "https://ap-south-1eymv9kl76.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600">{auth.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        auth={auth} 
        onLogout={signOutRedirect} 
        toggleSidebar={toggleSidebar}
      />

      <main className="pt-16">
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
