// src/pages/ApplicationSecurity.jsx

import { useContext } from "react";
import { ScanContext } from "../context/ScanContext";
import { Toaster } from "react-hot-toast";

function ApplicationSecurity() {
  const { scanResult } = useContext(ScanContext);

  if (!scanResult) {
    return <div className="p-8">Loading scan results...</div>;
  }

  const appSecurityResults = scanResult.groupedResults?.applicationSecurity;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />

      <h1 className="text-3xl font-bold text-purple-600 mb-6">
        🛡️ Application Security Overview
      </h1>

      {appSecurityResults ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(appSecurityResults).map(([controlName, controlData], idx) => (
            <div
              key={idx}
              className={`bg-white shadow-md rounded-lg p-6 ${
                controlData?.error ? "border-red-500" : "border-green-500"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2 capitalize">
                {controlName.replace(/([A-Z])/g, " $1").trim()}
              </h2>

              {controlData?.error ? (
                <p className="text-red-500">❌ {controlData.error}</p>
              ) : (
                <p className="text-green-600">✅ No Issues Found</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No Application Security findings available.</p>
      )}
    </div>
  );
}

export default ApplicationSecurity;
