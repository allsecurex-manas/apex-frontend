// src/pages/DNSSecurity.jsx

import { useContext } from "react";
import { ScanContext } from "../context/ScanContext";
import { Toaster } from "react-hot-toast";

function DNSSecurity() {
  const { scanResult } = useContext(ScanContext);

  if (!scanResult) {
    return <div className="p-8">Loading scan results...</div>;
  }

  const dnsResults = scanResult.groupedResults?.dnsSecurity;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />

      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        🌐 DNS Security Overview
      </h1>

      {dnsResults ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(dnsResults).map(([recordName, recordData], idx) => (
            <div
              key={idx}
              className={`bg-white shadow-md rounded-lg p-6 ${
                recordData?.error ? "border-red-500" : "border-green-500"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2 capitalize">
                {recordName.replace(/([A-Z])/g, " $1").trim()}
              </h2>

              {recordData?.error ? (
                <p className="text-red-500">❌ {recordData.error}</p>
              ) : (
                <p className="text-green-600">✅ No Issues Detected</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No DNS Security data available.</p>
      )}
    </div>
  );
}

export default DNSSecurity;
