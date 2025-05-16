// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

function Navbar({ auth, onLogout, toggleSidebar }) {
  const userAuth = useAuth();
  const userName = userAuth.user?.profile?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    await userAuth.removeUser();
    onLogout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-lg">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          {auth.isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg mr-4 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-bold text-blue-600 hidden sm:inline">Apex Security</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {!auth.isAuthenticated && (
            <button
              onClick={() => auth.signinRedirect()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>Login</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
          )}

          {auth.isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <div className="text-sm text-gray-600">Welcome,</div>
                <div className="font-medium text-gray-900 truncate max-w-[150px]">{userName}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <span className="hidden sm:inline">Logout</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
