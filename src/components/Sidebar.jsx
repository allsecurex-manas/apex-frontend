// src/components/Sidebar.jsx

import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard Home", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Email Security", path: "/dashboard/email-security" },
    { label: "Quantum Security", path: "/dashboard/quantum-security" },
    { label: "DNS Security", path: "/dashboard/dns-security" },
    { label: "Application Security", path: "/dashboard/application-security" },
    { label: "Cloud Security", path: "/dashboard/cloud-security" },
    { label: "Third Party Risk", path: "/dashboard/thirdparty-risk" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow fixed top-0 left-0 flex flex-col">
      <div className="text-2xl font-bold text-center text-blue-600 p-6 border-b">
        Apex Security
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="text-xs text-center text-gray-400 p-4 border-t">
        © {new Date().getFullYear()} AllSecureX
      </div>
    </aside>
  );
}

export default Sidebar;
