// src/pages/Home.jsx

import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay for transition effects
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleLoginClick = () => {
    auth.signinRedirect();
  };

  const features = [
    { 
      title: "Quantum Security", 
      desc: "Future-proof your systems with quantum-safe readiness scanning.", 
      icon: (
        <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: '#6366f1', marginBottom: '1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      title: "API Security", 
      desc: "Analyze and defend your API surfaces against breaches.", 
      icon: (
        <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: '#3b82f6', marginBottom: '1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    { 
      title: "Email Security", 
      desc: "SPF, DKIM, DMARC, phishing defense made easy.", 
      icon: (
        <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: '#60a5fa', marginBottom: '1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      title: "Cloud Risk Monitoring", 
      desc: "Real-time visibility across your cloud assets.", 
      icon: (
        <svg className="w-12 h-12 text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: '#93c5fd', marginBottom: '1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    { 
      title: "Third-Party Risk", 
      desc: "Evaluate vendors and supply chain cyber exposure.", 
      icon: (
        <svg className="w-12 h-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: '#818cf8', marginBottom: '1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    { 
      title: "DNS & Network Security", 
      desc: "Detect vulnerable domains, misconfigured SSL/TLS certificates.", 
      icon: (
        <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: '#c084fc', marginBottom: '1rem' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-start items-center px-4 sm:px-6 pt-24 pb-12" 
         style={{ 
           minHeight: '100vh', 
           background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff)',
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           paddingTop: '6rem',
           paddingBottom: '3rem',
           paddingLeft: '1rem',
           paddingRight: '1rem'
         }}>
      {/* Hero Section with shimmer background */}
      <div className={`relative max-w-5xl mx-auto text-center transition-all duration-1000 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
           style={{ 
             position: 'relative',
             maxWidth: '64rem',
             margin: '0 auto',
             textAlign: 'center',
             transition: 'all 1s ease-out',
             transform: isLoaded ? 'translateY(0)' : 'translateY(2.5rem)',
             opacity: isLoaded ? 1 : 0
           }}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(56,189,248,0.1),rgba(59,130,246,0.05)_50%,rgba(229,231,235,0)_100%)]"
             style={{ 
               position: 'absolute',
               inset: 0,
               zIndex: -10,
               backgroundImage: 'radial-gradient(45% 45% at 50% 50%, rgba(56, 189, 248, 0.1), rgba(59, 130, 246, 0.05) 50%, rgba(229, 231, 235, 0) 100%)'
             }}></div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
            style={{ 
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              letterSpacing: '-0.025em'
            }}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700"
                style={{ 
                  color: 'transparent',
                  backgroundClip: 'text',
                  backgroundImage: 'linear-gradient(to right, #2563eb, #4338ca)'
                }}>
            Welcome to Apex Security
          </span>
          <span className="inline-block ml-2 animate-float"
                style={{ 
                  display: 'inline-block',
                  marginLeft: '0.5rem',
                  animation: 'float 3s ease-in-out infinite'
                }}>🚀</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed"
           style={{ 
             fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
             color: '#374151',
             marginBottom: '2.5rem',
             maxWidth: '48rem',
             margin: '0 auto 2.5rem auto',
             lineHeight: 1.7
           }}>
          Quantum-Ready Cyber Risk Monitoring Platform.  
          Protect your business from emerging threats, ransomware, API vulnerabilities, DNS attacks, and much more — all automatically.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
             style={{ 
               display: 'flex',
               flexDirection: 'column',
               gap: '1.5rem',
               justifyContent: 'center',
               marginBottom: '4rem'
             }}>
          {auth.isAuthenticated ? (
            <button
              onClick={handleDashboardClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              style={{ 
                backgroundImage: 'linear-gradient(to right, #2563eb, #4338ca)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              style={{ 
                backgroundImage: 'linear-gradient(to right, #2563eb, #4338ca)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              Login to Apex Security
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto transition-all duration-1000 ease-out delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
           style={{ 
             display: 'grid',
             gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
             gap: '2rem',
             maxWidth: '80rem',
             margin: '0 auto',
             transition: 'all 1s ease-out 0.3s',
             transform: isLoaded ? 'translateY(0)' : 'translateY(2.5rem)',
             opacity: isLoaded ? 1 : 0
           }}>
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
            style={{ 
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #f3f4f6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              transitionDelay: `${150 * (idx % 3)}ms`,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              opacity: isLoaded ? 1 : 0
            }}
          >
            {feature.icon}
            <h3 className="text-xl font-bold mb-3 text-gray-800" style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1f2937' }}>{feature.title}</h3>
            <p className="text-gray-600" style={{ color: '#4b5563' }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom section with subtle gradient */}
      <div className="w-full mt-24 py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl max-w-7xl"
           style={{ 
             width: '100%',
             marginTop: '6rem',
             paddingTop: '3rem',
             paddingBottom: '3rem',
             backgroundImage: 'linear-gradient(to right, #eff6ff, #eef2ff)',
             borderRadius: '0.75rem',
             maxWidth: '80rem'
           }}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>Ready to secure your digital assets?</h2>
          <button
            onClick={auth.isAuthenticated ? handleDashboardClick : handleLoginClick}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
            style={{ 
              backgroundImage: 'linear-gradient(to right, #4f46e5, #9333ea)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease'
            }}
          >
            {auth.isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
