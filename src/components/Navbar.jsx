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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          {auth.isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg mr-3 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 lg:hidden transition-all duration-200"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center bg-white rounded-full h-9 w-9 shadow-md">
              <span className="text-xl">🛡️</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline tracking-tight">Apex Security</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {!auth.isAuthenticated && (
            <button
              onClick={() => auth.signinRedirect()}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md font-medium"
            >
              <span>Login</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
          )}

          {auth.isAuthenticated && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-xs text-blue-100">Welcome,</div>
                  <div className="font-medium text-white truncate max-w-[150px]">{userName}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20"
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
