import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
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

  const signOutRedirect = () => {
    const clientId = "2gnqpuoqn91kdlr71o613p6hbn";
    const logoutUri = "https://apex.allsecurex.com";
    const cognitoDomain = "https://ap-south-1eymv9kl76.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <div>Loading authentication...</div>;
  if (auth.error) return <div>Authentication Error: {auth.error.message}</div>;

  return (
    <>
      <Navbar auth={auth} onLogout={signOutRedirect} />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="email-security" element={<EmailSecurity />} />
            <Route path="quantum-security" element={<QuantumSecurity />} />
            <Route path="dns-security" element={<DNSSecurity />} />
            <Route path="application-security" element={<ApplicationSecurity />} />
            <Route path="cloud-security" element={<CloudSecurity />} />
            <Route path="thirdparty-risk" element={<ThirdPartyRisk />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
