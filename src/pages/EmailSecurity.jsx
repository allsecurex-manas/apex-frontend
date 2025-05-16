// src/pages/EmailSecurity.jsx

import { useContext } from "react";
import { ScanContext } from "../context/ScanContext";
import { Toaster, toast } from "react-hot-toast";

function EmailSecurity() {
  const { scanResult, loading, getLastScanInfo, startNewScan } = useContext(ScanContext);
  const lastScan = getLastScanInfo();
  
  console.log('Current scan result:', scanResult);

  // Get security data for the main domain (excluding wildcards and www)
  const getMainDomainData = (securityData) => {
    if (!securityData) return null;
    const mainDomain = Object.keys(securityData).find(domain => 
      !domain.startsWith('*') && !domain.startsWith('www.')
    );
    return mainDomain ? securityData[mainDomain] : null;
  };

  // Get security data from groupedResults
  const spfData = getMainDomainData(scanResult?.groupedResults?.spfSecurity);
  const dkimData = getMainDomainData(scanResult?.groupedResults?.dkimSecurity);
  const dmarcData = getMainDomainData(scanResult?.groupedResults?.dmarcSecurity);
  
  console.log('Retrieved security data:', {
    spf: spfData,
    dkim: dkimData,
    dmarc: dmarcData
  });

  const handleStartScan = async () => {
    try {
      console.log('Starting new scan...');
      await startNewScan();
      toast.success("✅ Scan started successfully!");
    } catch (error) {
      console.error('Scan start error:', error);
      toast.error("Failed to start scan");
    }
  };

  if (loading) {
    console.log('Component in loading state');
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-3xl animate-bounce">📧</span>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">Analyzing Email Security</h3>
          <p className="text-gray-600 mb-4">Please wait while we scan your email security configurations...</p>
          <div className="w-full max-w-xs mx-auto h-2 bg-orange-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scanResult || (!spfData && !dkimData && !dmarcData)) {
    console.log('No scan data available, showing empty state');
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg transform transition-all hover:scale-[1.01]">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📧</span>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">No Email Security Data</h3>
          <p className="text-gray-600 mb-8">Start a new scan to analyze your email security posture</p>
          <button
            onClick={handleStartScan}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Start Security Scan
          </button>
        </div>
      </div>
    );
  }

  const renderStatusCard = (title, data, recordKey) => {
    console.log(`Rendering status card for ${title}:`, data);
    
    const getStatusFromFindings = (findings) => {
      if (!findings || findings.length === 0) return 'pass';
      const severities = findings.map(f => f.severity.toLowerCase());
      if (severities.includes('critical')) return 'fail';
      if (severities.includes('high')) return 'fail';
      if (severities.includes('medium')) return 'partial';
      if (severities.includes('low')) return 'partial';
      return 'pass';
    };

    const status = getStatusFromFindings(data?.findings);
    const rawRecord = data?.[recordKey];

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'pass':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'fail':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'partial':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-600">Record</span>
            <span className="font-mono text-sm bg-gray-50 p-2 rounded break-all">
              {rawRecord || 'Not configured'}
            </span>
          </div>
          {data?.findings?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Findings</h4>
              <div className="space-y-2">
                {data.findings.map((finding, idx) => (
                  <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-600">{finding.observation}</span>
                      <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                        finding.severity === "Critical" ? "bg-red-100 text-red-800" :
                        finding.severity === "High" ? "bg-orange-100 text-orange-800" :
                        finding.severity === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        finding.severity === "Low" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                    {finding.potentialAttacks && (
                      <div className="mt-1 text-xs text-red-600">
                        Potential Attacks: {finding.potentialAttacks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Combine findings from all three components
  const allFindings = [
    ...(spfData?.findings || []),
    ...(dkimData?.findings || []),
    ...(dmarcData?.findings || [])
  ];
  console.log('Combined findings:', allFindings);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <Toaster position="top-center" />

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <span className="text-2xl transform transition-transform hover:rotate-12">📧</span>
              Email Security
              {allFindings.length > 0 && (
                <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200 animate-pulse">
                  {allFindings.length} Issues Detected
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              Analyzing email security for {lastScan?.domain}
              {lastScan?.time && (
                <span className="text-sm text-gray-500 ml-2">
                  (Last scan: {new Date(lastScan.time).toLocaleString()})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleStartScan}
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-150 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rescan
          </button>
        </div>
      </div>

      {/* Email Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SPF Card */}
        {renderStatusCard("SPF Record", spfData, "rawSPFRecord")}

        {/* DMARC Card */}
        {renderStatusCard("DMARC Record", dmarcData, "rawDMARCRecord")}

        {/* DKIM Card */}
        {renderStatusCard("DKIM Record", dkimData, "rawDKIMRecord")}
      </div>

      {/* Findings Section */}
      {allFindings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Security Findings</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {allFindings.map((finding, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:border-orange-200 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{finding.controlName}</h4>
                      <p className="text-sm text-gray-600 mb-2">{finding.observation}</p>
                      {finding.potentialAttacks && (
                        <div className="text-sm bg-red-50 text-red-700 p-2 rounded mt-2">
                          <span className="font-medium">Potential Attacks:</span> {finding.potentialAttacks}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      finding.severity === "Critical" ? "bg-red-100 text-red-800" :
                      finding.severity === "High" ? "bg-orange-100 text-orange-800" :
                      finding.severity === "Medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {finding.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailSecurity;
