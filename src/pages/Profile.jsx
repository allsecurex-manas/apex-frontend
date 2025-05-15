// src/pages/Profile.jsx

import { useAuth } from "react-oidc-context";
import { useContext } from "react";
import { ScanContext } from "../context/ScanContext"; // ✅ Context to share scan results
import { Toaster } from "react-hot-toast";

function Profile() {
  const auth = useAuth();
  const { scanResult } = useContext(ScanContext);

  const userName = auth.user?.profile?.email || "User";
  const userDomain = userName.split("@")[1];

  const lastScanTime = scanResult?.timestamp || "Not Available";

  const calculateSecurityGrade = (result) => {
    if (!result || !result.groupedResults) return "N/A";
    const modules = Object.values(result.groupedResults);
    const totalModules = modules.length;
    let passed = modules.filter(m => {
      const firstKey = Object.keys(m)[0];
      return firstKey && !m[firstKey]?.error;
    }).length;
    const percent = (passed / totalModules) * 100;
    if (percent >= 90) return "A+";
    if (percent >= 75) return "A";
    if (percent >= 60) return "B";
    if (percent >= 45) return "C";
    return "D";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />

      <h1 className="text-3xl font-bold mb-6 text-blue-600">👤 Profile Information</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4 max-w-xl">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-900">{userName}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Domain:</span>
          <span className="text-gray-900">{userDomain}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Last Scan Timestamp:</span>
          <span className="text-gray-900">{lastScanTime}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Security Grade:</span>
          <span className="font-bold text-green-600">
            {calculateSecurityGrade(scanResult)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
