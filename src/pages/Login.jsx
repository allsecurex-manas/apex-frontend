import LoginButton from "../components/LoginButton";
import { useState, useEffect } from "react";

function Login() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay for transition effects
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className={`w-full max-w-md transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-blue-100">
                Sign in to continue to Apex Security
              </p>
            </div>
          </div>
          
          {/* Body section */}
          <div className="px-6 py-8 sm:px-10 bg-white">
            <div className="flex items-center justify-center mb-6">
              <span className="inline-block p-3 rounded-full bg-blue-50">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Authentication</h3>
              <p className="text-gray-500 text-sm">
                Login securely with AWS Cognito Single Sign-On
              </p>
            </div>
            
            <LoginButton />
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
