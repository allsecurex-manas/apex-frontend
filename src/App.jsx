// src/App.jsx

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";  // 👈 Make sure Login.jsx exists (even simple page)
import Signup from "./pages/Signup"; // 👈 Make sure Signup.jsx exists (even simple page)

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

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Encountered error: {auth.error.message}</div>;
  }

  return (
    <>
      <Navbar auth={auth} onLogout={signOutRedirect} />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
