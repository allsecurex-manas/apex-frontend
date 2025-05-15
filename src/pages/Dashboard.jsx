// src/pages/Dashboard.jsx

import { useAuth } from "react-oidc-context";

function Dashboard() {
  const auth = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🚀 Welcome to Apex Security Dashboard
        </h1>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Hello, {auth.user?.profile.email || "User"}!
          </h2>
          <p className="text-gray-600">
            You are successfully authenticated with Cognito! 🎉
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-bold text-gray-700 mb-2">🔐 ID Token</h3>
            <div className="break-words text-gray-600 text-sm">
              {auth.user?.id_token ? auth.user.id_token.substring(0, 50) + "..." : "Not Available"}
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-bold text-gray-700 mb-2">⚡ Access Token</h3>
            <div className="break-words text-gray-600 text-sm">
              {auth.user?.access_token ? auth.user.access_token.substring(0, 50) + "..." : "Not Available"}
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg shadow-md hover:shadow-lg transition md:col-span-2">
            <h3 className="text-lg font-bold text-gray-700 mb-2">🔄 Refresh Token</h3>
            <div className="break-words text-gray-600 text-sm">
              {auth.user?.refresh_token ? auth.user.refresh_token.substring(0, 50) + "..." : "Not Available"}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => auth.removeUser()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
