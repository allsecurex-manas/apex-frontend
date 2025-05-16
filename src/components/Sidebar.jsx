// src/components/Sidebar.jsx

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function Sidebar({ isOpen }) {
  const location = useLocation();
  const auth = useAuth();
  const userName = auth.user?.profile?.email?.split('@')[0] || 'User';

  const menuItems = [
    { 
      label: "Dashboard Home", 
      path: "/dashboard",
      icon: "🏠"
    },
    { 
      label: "Profile", 
      path: "/dashboard/profile",
      icon: "👤"
    },
    { 
      label: "Email Security", 
      path: "/dashboard/email-security",
      icon: "📧"
    },
    { 
      label: "Quantum Security", 
      path: "/dashboard/quantum-security",
      icon: "🔐"
    },
    { 
      label: "DNS Security", 
      path: "/dashboard/dns-security",
      icon: "🌐"
    },
    { 
      label: "Application Security", 
      path: "/dashboard/application-security",
      icon: "🛡️"
    },
    { 
      label: "Cloud Security", 
      path: "/dashboard/cloud-security",
      icon: "☁️"
    },
    { 
      label: "API Security", 
      path: "/dashboard/api-security",
      icon: "🔌"
    },
    { 
      label: "Data Security", 
      path: "/dashboard/data-security",
      icon: "💾"
    },
    { 
      label: "Network Security", 
      path: "/dashboard/network-security",
      icon: "🌐"
    },
    { 
      label: "Third Party Risk", 
      path: "/dashboard/thirdparty-risk",
      icon: "🔗"
    },
  ];

  return (
    <aside 
      className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* User Profile Section */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {userName[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-500">Security Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
