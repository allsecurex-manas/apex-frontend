// src/pages/DashboardHome.jsx

import { useContext, useState, useEffect } from "react";
import { ScanContext } from "../context/ScanContext";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Toaster, toast } from "react-hot-toast";

function DashboardHome() {
  const { scanResult, startNewScan, loading } = useContext(ScanContext);
  const [rescanLoading, setRescanLoading] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ passedModules: 0, totalModules: 0 });

  const COLORS = ["#10B981", "#EF4444"]; // Green for passed, Red for issues
  const modules = Object.values(scanResult?.groupedResults || {});
  const totalModules = modules.length;
  const passedModules = modules.filter(m => {
    const firstKey = Object.keys(m)[0];
    return firstKey && !m[firstKey]?.error;
  }).length;
  const failedModules = totalModules - passedModules;

  useEffect(() => {
    if (scanResult) {
      // Animate stats
      const timer = setTimeout(() => {
        setAnimatedStats({ passedModules, totalModules });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scanResult, passedModules, totalModules]);

  const pieData = [
    { name: "Secured", value: passedModules },
    { name: "Issues", value: failedModules },
  ];

  const barData = Object.entries(scanResult?.groupedResults || {}).map(([module, controlData]) => {
    const firstControlKey = Object.keys(controlData)[0];
    const hasIssue = controlData[firstControlKey]?.error ? 1 : 0;
    return { 
      name: module.replace(/([A-Z])/g, ' $1').trim(), 
      Issues: hasIssue,
      Status: hasIssue ? "Failed" : "Passed" 
    };
  });

  const calculateGrade = () => {
    if (!totalModules) return { grade: "N/A", color: "text-gray-400" };
    const percent = (passedModules / totalModules) * 100;
    if (percent >= 90) return { grade: "A+", color: "text-green-500" };
    if (percent >= 75) return { grade: "A", color: "text-green-400" };
    if (percent >= 60) return { grade: "B", color: "text-yellow-500" };
    if (percent >= 45) return { grade: "C", color: "text-orange-500" };
    return { grade: "D", color: "text-red-500" };
  };

  const handleStartScan = async () => {
    setRescanLoading(true);
    try {
      await startNewScan();
      toast.success("✅ Scan started successfully!");
    } catch (error) {
      toast.error("Failed to start scan");
    } finally {
      setRescanLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" />

      {/* If no scan started */}
      {!scanResult && !loading && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-10 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Welcome to Your Security Command Center</h3>
            <p className="text-gray-600 mb-8">Start your first comprehensive security scan to analyze vulnerabilities and receive actionable insights for your domain.</p>
            <button
              onClick={handleStartScan}
              disabled={rescanLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {rescanLoading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Starting Scan...
                </>
              ) : (
                <>Start Security Scan</>
              )}
            </button>
            
            <div className="grid grid-cols-3 gap-3 mt-10">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-1">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-center">Fast Analysis</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-1">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-center">Accurate Results</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-1">
                  <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-center">Actionable Steps</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If scanning */}
      {loading && !scanResult && (
        <div className="bg-white rounded-xl p-8 text-center border border-blue-100 shadow-md">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-30"></div>
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-blue-50 border-4 border-blue-100">
                <svg className="w-12 h-12 text-blue-600 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-700 mb-3">Scanning Your Domain</h3>
            <p className="text-gray-600 mb-8 max-w-md">We're analyzing your security posture across multiple vectors. This comprehensive scan may take a few minutes...</p>
            
            <div className="w-full max-w-md h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg">
              {['Email Security', 'API Security', 'DNS Security', 'Cloud Security'].map((module, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="inline-block h-4 w-4 rounded-full bg-blue-200 mb-2 animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}></div>
                  <div className="text-xs font-medium text-gray-500">{module}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* If scan completed */}
      {scanResult && (
        <div className="space-y-6">
          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={handleStartScan}
              disabled={rescanLoading || loading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {rescanLoading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Rescanning...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Rescan Now</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Score Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security Score
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center flex-col">
                  <div className={`text-7xl font-bold mb-4 ${calculateGrade().color}`}>
                    {calculateGrade().grade}
                  </div>
                  <div className="text-gray-600 mb-4">
                    {passedModules} of {totalModules} checks passed
                  </div>
                  
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${(passedModules / Math.max(totalModules, 1)) * 100}%` }} 
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Security Score: {Math.round((passedModules / Math.max(totalModules, 1)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Overview */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Security Overview
                </h2>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        animationDuration={1500}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                <p className="font-semibold">{payload[0].name}</p>
                                <p className="text-gray-600">
                                  Value: {payload[0].value} ({((payload[0].value / totalModules) * 100).toFixed(0)}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        formatter={(value, entry, index) => (
                          <span className="text-gray-700 font-medium">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Security Modules Status */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Security Modules Status
              </h2>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      interval={0}
                      tick={{ fill: '#4B5563', fontSize: 12 }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: '#4B5563', fontSize: 12 }}
                      domain={[0, 1]}
                      tickFormatter={(value) => value === 0 ? 'Passed' : 'Issues'}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const { Status } = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-semibold">{payload[0].payload.name}</p>
                              <p className={`${Status === "Passed" ? "text-green-600" : "text-red-600"} font-medium`}>
                                Status: {Status}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="Issues" 
                      animationDuration={1500}
                      shape={(props) => {
                        const { x, y, width, height, payload } = props;
                        const fillColor = payload.Status === "Passed" ? "#10B981" : "#EF4444";
                        const gradientId = payload.Status === "Passed" ? "passedGradient" : "failedGradient";
                        
                        return (
                          <g>
                            <defs>
                              <linearGradient id="passedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#10B981" stopOpacity={0.6}/>
                              </linearGradient>
                              <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.6}/>
                              </linearGradient>
                            </defs>
                            <rect
                              x={x}
                              y={y}
                              width={width}
                              height={height}
                              fill={`url(#${gradientId})`}
                              rx={4}
                              ry={4}
                              stroke={fillColor}
                              strokeWidth={1}
                            />
                          </g>
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default DashboardHome;
