import SignupButton from "../components/SignupButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Signup() {
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
                Join Apex Security
              </h2>
              <p className="text-blue-100">
                Create your account to get started
              </p>
            </div>
          </div>
          
          {/* Body section */}
          <div className="px-6 py-8 sm:px-10 bg-white">
            <div className="flex items-center justify-center mb-6">
              <span className="inline-block p-3 rounded-full bg-blue-50">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Your Account</h3>
              <p className="text-gray-500 text-sm">
                Sign up for Apex Security to protect your digital assets
              </p>
            </div>
            
            <SignupButton />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
