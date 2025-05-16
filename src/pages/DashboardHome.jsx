// src/pages/DashboardHome.jsx

import { useContext, useState, useEffect } from "react";
import { ScanContext } from "../context/ScanContext";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Toaster, toast } from "react-hot-toast";

function DashboardHome() {
  const { scanResult, startNewScan, loading } = useContext(ScanContext);
  const [rescanLoading, setRescanLoading] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ passedModules: 0, totalModules: 0 });

  const COLORS = ["#10B981", "#EF4444"]; // Updated colors for better contrast
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
        <div className="bg-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Welcome to Security Dashboard</h3>
          <p className="text-gray-600 mb-6">Start your first security scan to analyze your domain</p>
          <button
            onClick={handleStartScan}
            disabled={rescanLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {rescanLoading ? "Starting Scan..." : "Start Security Scan"}
          </button>
        </div>
      )}

      {/* If scanning */}
      {loading && !scanResult && (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Scanning Your Domain</h3>
          <p className="text-gray-600">This may take a few minutes...</p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {rescanLoading ? "Rescanning..." : "Rescan Now"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Score Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Security Score</h2>
              <div className="flex items-center justify-center flex-col">
                <div className={`text-6xl font-bold mb-2 ${calculateGrade().color}`}>
                  {calculateGrade().grade}
                </div>
                <div className="text-gray-600">
                  {passedModules} of {totalModules} checks passed
                </div>
              </div>
            </div>
            
            {/* Security Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Security Overview</h2>
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
                      label
                      animationDuration={1500}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Security Modules Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Security Modules Status</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    interval={0}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                            <p className="font-semibold">{payload[0].payload.name}</p>
                            <p className={`${payload[0].payload.Status === "Passed" ? "text-green-500" : "text-red-500"}`}>
                              Status: {payload[0].payload.Status}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="Issues" 
                    fill="#EF4444"
                    animationDuration={1500}
                    shape={(props) => {
                      const { x, y, width, height } = props;
                      return (
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={props.payload.Status === "Passed" ? "#10B981" : "#EF4444"}
                          rx={4}
                          ry={4}
                        />
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
