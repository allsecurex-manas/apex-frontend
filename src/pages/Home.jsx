// src/pages/Home.jsx

import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleLoginClick = () => {
    auth.signinRedirect();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-6">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-600">
        Welcome to Apex Security 🚀
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl">
        Quantum-Ready Cyber Risk Monitoring Platform.  
        Protect your business from emerging threats, ransomware, API vulnerabilities, DNS attacks, and much more — all automatically.
      </p>

      {/* Call-to-action buttons */}
      <div className="flex flex-col sm:flex-row gap-6 mb-12">
        {auth.isAuthenticated ? (
          <button
            onClick={handleDashboardClick}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-green-700 transition"
          >
            Login to Apex Security
          </button>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {[
          { title: "Quantum Security", desc: "Future-proof your systems with quantum-safe readiness scanning." },
          { title: "API Security", desc: "Analyze and defend your API surfaces against breaches." },
          { title: "Email Security", desc: "SPF, DKIM, DMARC, phishing defense made easy." },
          { title: "Cloud Risk Monitoring", desc: "Real-time visibility across your cloud assets." },
          { title: "Third-Party Risk", desc: "Evaluate vendors and supply chain cyber exposure." },
          { title: "DNS & Network Security", desc: "Detect vulnerable domains, misconfigured SSL/TLS certificates." },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-500">{feature.title}</h3>
            <p className="text-gray-700">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
