// src/pages/ApplicationSecurity.jsx

import { useContext } from "react";
import { ScanContext } from "../context/ScanContext";
import { Toaster, toast } from "react-hot-toast";

function ApplicationSecurity() {
  const { scanResult, loading, getModuleData, hasModuleErrors, getLastScanInfo, startNewScan } = useContext(ScanContext);
  const appSecurityData = getModuleData("applicationSecurity");
  const lastScan = getLastScanInfo();

  const handleStartScan = async () => {
    try {
      await startNewScan();
      toast.success("✅ Scan started successfully!");
    } catch (error) {
      toast.error("Failed to start scan");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-3xl animate-bounce">🛡️</span>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">Analyzing Application Security</h3>
          <p className="text-gray-600 mb-4">Please wait while we scan your application security...</p>
          <div className="w-full max-w-xs mx-auto h-2 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scanResult || !appSecurityData) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg transform transition-all hover:scale-[1.01]">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🛡️</span>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">No Application Security Data</h3>
          <p className="text-gray-600 mb-8">Start a new scan to analyze your application security posture</p>
          <button
            onClick={handleStartScan}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Start Security Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <Toaster position="top-center" />

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <span className="text-2xl transform transition-transform hover:rotate-12">🛡️</span>
              Application Security
              {hasModuleErrors("applicationSecurity") && (
                <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200 animate-pulse">
                  Issues Detected
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              Analyzing application security for {lastScan?.domain}
              {lastScan?.time && (
                <span className="text-sm text-gray-500 ml-2">
                  (Last scan: {new Date(lastScan.time).toLocaleString()})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleStartScan}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-150 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rescan
          </button>
        </div>
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(appSecurityData).map(([domain, data]) => (
          <div key={domain} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              {domain}
            </h2>
            
            {data.findings && data.findings.length > 0 ? (
              <div className="space-y-4">
                {data.findings.map((finding, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg p-4 hover:border-purple-200 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{finding.controlName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        finding.severity === "Critical" ? "bg-red-100 text-red-800" :
                        finding.severity === "High" ? "bg-orange-100 text-orange-800" :
                        finding.severity === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{finding.observation}</p>
                    {finding.potentialAttacks && (
                      <div className="text-sm bg-red-50 text-red-700 p-2 rounded">
                        <span className="font-medium">Potential Attacks:</span> {finding.potentialAttacks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No findings available for this domain</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationSecurity;
