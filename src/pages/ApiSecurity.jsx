import { useContext, useEffect } from "react";
import { ScanContext } from "../context/ScanContext";
import { Toaster, toast } from "react-hot-toast";

function ApiSecurity() {
  const { scanResult, loading, getModuleData, hasModuleErrors, getLastScanInfo, startNewScan } = useContext(ScanContext);
  const apiSecurityData = getModuleData("apiSecurity");
  const lastScan = getLastScanInfo();

  const handleStartScan = async () => {
    try {
      await startNewScan();
      toast.success("✅ Scan started successfully!");
    } catch (error) {
      toast.error("Failed to start scan");
    }
  };

  // Group findings by severity
  const groupFindingsBySeverity = (findings) => {
    return findings.reduce((acc, finding) => {
      const severity = finding.severity || "Unknown";
      if (!acc[severity]) {
        acc[severity] = [];
      }
      acc[severity].push(finding);
      return acc;
    }, {});
  };

  // Helper for getting severity data
  const getSeverityConfig = (severity) => {
    const configs = {
      Critical: {
        color: "from-red-500 to-red-700",
        hoverColor: "group-hover:from-red-600 group-hover:to-red-800",
        textColor: "text-red-400",
        bgColor: "bg-red-950/30",
        borderColor: "border-red-500/30",
        icon: "M12 9v2m0.5 4h0.01M6 20h12a2 2 0 002-2V9.41a2 2 0 00-.38-1.17l-6-7.48a2 2 0 00-3.24 0l-6 7.48A2 2 0 003 9.41V18a2 2 0 002 2z"
      },
      High: {
        color: "from-orange-500 to-orange-700",
        hoverColor: "group-hover:from-orange-600 group-hover:to-orange-800",
        textColor: "text-orange-400",
        bgColor: "bg-orange-950/30",
        borderColor: "border-orange-500/30",
        icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      Medium: {
        color: "from-yellow-500 to-yellow-700",
        hoverColor: "group-hover:from-yellow-600 group-hover:to-yellow-800",
        textColor: "text-yellow-400",
        bgColor: "bg-yellow-950/30",
        borderColor: "border-yellow-500/30",
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      Low: {
        color: "from-blue-500 to-blue-700",
        hoverColor: "group-hover:from-blue-600 group-hover:to-blue-800",
        textColor: "text-blue-400",
        bgColor: "bg-blue-950/30",
        borderColor: "border-blue-500/30",
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      Unknown: {
        color: "from-slate-500 to-slate-700",
        hoverColor: "group-hover:from-slate-600 group-hover:to-slate-800",
        textColor: "text-slate-400",
        bgColor: "bg-slate-950/30",
        borderColor: "border-slate-500/30",
        icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    };
    
    return configs[severity] || configs.Unknown;
  };

  // Add typing effect for text
  useEffect(() => {
    const addTypingEffect = () => {
      const typingElements = document.querySelectorAll('.typing-effect');
      typingElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        element.classList.add('typing-cursor');
        
        let i = 0;
        const typeChar = () => {
          if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeChar, Math.random() * 40 + 20);
          } else {
            element.classList.remove('typing-cursor');
          }
        };
        
        setTimeout(typeChar, 200);
      });
    };
    
    if (!loading && scanResult && apiSecurityData) {
      addTypingEffect();
    }
  }, [loading, scanResult, apiSecurityData]);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg max-w-md w-full text-center relative">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <svg className="w-12 h-12 text-blue-600 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Scanning API Endpoints</h3>
          <p className="text-gray-600 mb-6">Analyzing network security and detecting potential vulnerabilities...</p>
          
          <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-2/3 animate-pulse"></div>
          </div>
          
          <p className="text-sm text-gray-500 font-medium">This may take a moment</p>
        </div>
      </div>
    );
  }

  // No scan data state
  if (!scanResult || !apiSecurityData) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg max-w-md w-full text-center relative">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">API Security Scanner</h3>
          <p className="text-gray-600 mb-6">Scan your API endpoints to detect security vulnerabilities and ensure best practices</p>
          
          <button
            onClick={handleStartScan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Start Security Scan</span>
          </button>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-800 mb-1">Vulnerability Detection</div>
              <div className="text-xs text-gray-500">Identifies security weaknesses</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-800 mb-1">Best Practices</div>
              <div className="text-xs text-gray-500">Recommends security improvements</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render findings
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e2e8f0',
            fontWeight: '500',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }
        }} 
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex flex-wrap items-center gap-3">
                  API Security Dashboard
                  {hasModuleErrors("apiSecurity") && (
                    <span className="text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="block w-1.5 h-1.5 rounded-full bg-white"></span> 
                      Vulnerabilities detected
                    </span>
                  )}
                </h1>
                <div className="text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  {lastScan?.domain && (
                    <span className="font-medium">{lastScan.domain}</span>
                  )}
                  {lastScan?.time && (
                    <span className="text-gray-400">
                      Last scan: {new Date(lastScan.time).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleStartScan}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 w-full lg:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Scan Now</span>
            </button>
          </div>

          {/* Summary Cards */}
          {Object.keys(apiSecurityData).length > 0 && Object.values(apiSecurityData).some(data => data?.findings?.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {["Critical", "High", "Medium", "Low"].map(severity => {
                const config = getSeverityConfig(severity);
                const count = Object.values(apiSecurityData).reduce((total, data) => {
                  return total + (data?.findings?.filter(f => f.severity === severity) || []).length;
                }, 0);
                
                const severityColors = {
                  Critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500' },
                  High: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-500' },
                  Medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-500' },
                  Low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' }
                };
                
                const colors = severityColors[severity];
                
                return (
                  <div key={severity} className={`${colors.bg} rounded-xl border ${colors.border} p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 ${colors.icon} flex items-center justify-center`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={config.icon} />
                        </svg>
                      </div>
                      <span className={`text-xs font-semibold ${colors.text} bg-white px-2 py-0.5 rounded-full`}>
                        {severity}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-end gap-1">
                        <p className={`text-3xl font-bold ${colors.text}`}>{count}</p>
                        <p className={`text-sm ${colors.text} opacity-70 mb-1`}>
                          {count === 1 ? 'issue' : 'issues'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Findings */}
      <div className="max-w-7xl mx-auto space-y-6">
        {Object.entries(apiSecurityData).map(([domain, data]) => {
          if (!data?.findings || data.findings.length === 0) return null;
          
          const groupedFindings = groupFindingsBySeverity(data.findings);
          
          return (
            <div key={domain} className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <h2 className="text-lg font-bold text-gray-800">{domain}</h2>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                  {["Critical", "High", "Medium", "Low"].map(severity => {
                    const count = (data?.findings?.filter(f => f.severity === severity) || []).length;
                    if (count === 0) return null;
                    
                    const severityColors = {
                      Critical: 'bg-red-100 text-red-800',
                      High: 'bg-orange-100 text-orange-800',
                      Medium: 'bg-yellow-100 text-yellow-800',
                      Low: 'bg-blue-100 text-blue-800'
                    };
                    
                    return (
                      <div key={severity} className={`${severityColors[severity]} text-xs font-medium px-2 py-0.5 rounded-full`}>
                        {severity}: {count}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {Object.entries(groupedFindings).map(([severity, findings]) => {
                  const severityColors = {
                    Critical: { bg: 'bg-red-50', text: 'text-red-700', light: 'bg-red-100', border: 'border-red-200' },
                    High: { bg: 'bg-orange-50', text: 'text-orange-700', light: 'bg-orange-100', border: 'border-orange-200' },
                    Medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', light: 'bg-yellow-100', border: 'border-yellow-200' },
                    Low: { bg: 'bg-blue-50', text: 'text-blue-700', light: 'bg-blue-100', border: 'border-blue-200' },
                    Unknown: { bg: 'bg-gray-50', text: 'text-gray-700', light: 'bg-gray-100', border: 'border-gray-200' }
                  };
                  
                  const colors = severityColors[severity] || severityColors.Unknown;
                  
                  return (
                    <div key={severity} className="px-6 py-4">
                      <details className="group" open={severity === "Critical" || severity === "High"}>
                        <summary className="flex items-center justify-between cursor-pointer list-none">
                          <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className={`${colors.light} ${colors.text} px-2 py-0.5 rounded text-xs font-semibold`}>
                              {severity}
                            </span>
                            <span className="text-gray-600">
                              {findings.length} {findings.length === 1 ? 'Finding' : 'Findings'}
                            </span>
                          </h3>
                          <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        
                        <div className="mt-4 space-y-4">
                          {findings.map((finding, index) => (
                            <div 
                              key={index}
                              className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                <div className="lg:col-span-3">
                                  <h4 className="font-bold text-gray-800 mb-2">{finding.controlName}</h4>
                                  <p className="text-gray-600 text-sm mb-4">{finding.observation}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {finding.potentialAttacks && (
                                      <div className="bg-white border border-red-200 text-red-800 p-3 rounded-lg text-sm">
                                        <div className="flex items-start gap-2">
                                          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                          </svg>
                                          <div>
                                            <div className="font-semibold mb-1">Potential Attacks</div>
                                            <div className="text-red-700">{finding.potentialAttacks}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {finding.recommendation && (
                                      <div className="bg-white border border-green-200 text-green-800 p-3 rounded-lg text-sm">
                                        <div className="flex items-start gap-2">
                                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          <div>
                                            <div className="font-semibold mb-1">Recommendation</div>
                                            <div className="text-green-700">{finding.recommendation}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="space-y-3">
                                    <div className="bg-white border border-gray-200 rounded p-3">
                                      <div className="text-xs text-gray-500 mb-1">CONTROL ID</div>
                                      <div className="text-gray-800 font-mono text-sm">{finding.controlId}</div>
                                    </div>
                                    
                                    <div className="bg-white border border-gray-200 rounded p-3">
                                      <div className="text-xs text-gray-500 mb-1">SEVERITY</div>
                                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${colors.light} ${colors.text}`}>
                                        {severity}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  );
                })}
                
                {/* No findings case */}
                {Object.keys(groupedFindings).length === 0 && (
                  <div className="p-6 text-center">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-xl font-medium text-gray-800 mb-1">Security Verified</h4>
                    <p className="text-gray-500">No security findings detected for this domain.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* No data case */}
        {Object.keys(apiSecurityData).length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-md">
            <svg className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No API Security Data Available</h3>
            <p className="text-gray-600 mb-6">Your scan completed successfully, but no API endpoints were detected.</p>
            <button
              onClick={handleStartScan}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Run Scan
            </button>
          </div>
        )}
      </div>
      
      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
        
        /* For the accordion animation */
        details summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ApiSecurity; 