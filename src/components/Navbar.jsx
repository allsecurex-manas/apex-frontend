// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

function Navbar({ auth, onLogout }) {
  const userAuth = useAuth();

  const handleLogout = async () => {
    await userAuth.removeUser(); // 🛡️ Clear local user cache (very important)
    onLogout(); // 🔥 Then call Cognito logout redirect
  };

  return (
    <nav className="bg-white border-b shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Apex Security
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          {auth.isAuthenticated && (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
          )}
          
          {auth.isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => auth.signinRedirect()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
