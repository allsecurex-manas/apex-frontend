// src/pages/QuantumSecurity.jsx

import { useContext, useMemo } from "react";
import { ScanContext } from "../context/ScanContext";
import { Toaster, toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const SEVERITY_COLORS = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#10B981",
};

const CHART_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

function QuantumSecurity() {
  const { scanResult, loading, getModuleData, hasModuleErrors, getLastScanInfo, startNewScan } = useContext(ScanContext);
  const quantumData = getModuleData("quantumSecurity");
  const lastScan = getLastScanInfo();

  // Calculate financial impact based on severity score
  const calculateFinancialImpact = (severityScore) => {
    const baseImpact = 1000000; // Base impact of $1M
    return Math.round((severityScore / 10) * baseImpact);
  };

  // Prepare data for charts with validation
  const prepareChartData = useMemo(() => {
    if (!quantumData) return null;

    try {
      const mainDomain = Object.values(quantumData).find(
        (domain) => !domain.error && domain.quantumExposure
      );

      if (!mainDomain) {
        console.warn("No valid domain data found in quantum security results");
        return null;
      }

      const { quantumExposure } = mainDomain;

      if (!quantumExposure || !quantumExposure.pqcControls) {
        console.warn("Invalid quantum exposure data structure");
        return null;
      }

      // Severity distribution data
      const severityData = quantumExposure.pqcControls.reduce((acc, control) => {
        if (control && control.severity) {
          acc[control.severity] = (acc[control.severity] || 0) + 1;
        }
        return acc;
      }, {});

      const pieData = Object.entries(severityData).map(([severity, count]) => ({
        name: severity,
        value: count,
      }));

      // Standards adoption data
      const standardsData = quantumExposure.pqcControls
        .filter((control) => control.pqcStandard && control.pqcStandard !== "N/A" && control.pqcStandard !== "None")
        .reduce((acc, control) => {
          acc[control.pqcStandard] = (acc[control.pqcStandard] || 0) + 1;
          return acc;
        }, {});

      const barData = Object.entries(standardsData).map(([standard, count]) => ({
        name: standard,
        count: count,
      }));

      // Risk radar data with validation
      const radarData = [
        {
          subject: "PKI Risk",
          value: quantumExposure.severityScore || 0,
          fullMark: 10,
        },
        {
          subject: "Key Exchange",
          value: mainDomain.certificateInfo?.keyType === "ECC" ? 8.5 : 6.5,
          fullMark: 10,
        },
        {
          subject: "Hash Security",
          value: mainDomain.certificateInfo?.hashAlgorithm === "Unknown" ? 7.5 : 5.5,
          fullMark: 10,
        },
        {
          subject: "Cipher Strength",
          value: mainDomain.certificateInfo?.tlsProtocol === "TLSv1.3" ? 6.5 : 8.5,
          fullMark: 10,
        },
        {
          subject: "Protocol Security",
          value: quantumExposure.isQuantumVulnerable ? 7.0 : 4.0,
          fullMark: 10,
        },
      ];

      return {
        pieData,
        barData,
        radarData,
        mainDomain,
      };
    } catch (error) {
      console.error("Error preparing chart data:", error);
      return null;
    }
  }, [quantumData]);

  const handleStartScan = async () => {
    try {
      await startNewScan();
    } catch (error) {
      toast.error("Failed to start the scan. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="animate-spin text-6xl mb-6">🔐</div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Analyzing Quantum Security</h3>
          <p className="text-gray-600">Evaluating quantum resistance of cryptographic systems...</p>
        </div>
      </div>
    );
  }

  if (!scanResult || !quantumData || !prepareChartData) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-6">🔐</div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">No Quantum Security Data</h3>
          <p className="text-gray-600 mb-8">Start a new scan to analyze quantum security posture.</p>
          <button
            onClick={handleStartScan}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Scan
          </button>
        </div>
      </div>
    );
  }

  const { pieData, barData, radarData, mainDomain } = prepareChartData;
  const { quantumExposure, certificateInfo } = mainDomain;
  const financialImpact = calculateFinancialImpact(quantumExposure.severityScore);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-2">
              🔐 Quantum Security Analysis
              {hasModuleErrors("quantumSecurity") && (
                <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">
                  Vulnerabilities Detected
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              Analysis for {lastScan?.domain || "your domain"}
              {lastScan?.time && (
                <span className="text-sm text-gray-500 ml-2">
                  (Last scan: {new Date(lastScan.time).toLocaleString()})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleStartScan}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Rescan
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800">Severity Score</h3>
          <p className={`text-4xl font-bold mt-2 ${
            quantumExposure.severityScore > 7 ? "text-red-500" : 
            quantumExposure.severityScore > 5 ? "text-yellow-500" : "text-green-500"
          }`}>
            {quantumExposure.severityScore}/10
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800">Estimated Financial Impact</h3>
          <p className="text-4xl font-bold mt-2 text-blue-600">
            ${(financialImpact / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800">Key Type</h3>
          <p className="text-4xl font-bold mt-2 text-purple-600">
            {certificateInfo.keyType}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800">TLS Protocol</h3>
          <p className="text-4xl font-bold mt-2 text-indigo-600">
            {certificateInfo.tlsProtocol}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Severity Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Severity Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Radar */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Risk Radar</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar
                  name="Risk Level"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PQC Standards Adoption */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">PQC Standards Adoption</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Controls Count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issues and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Detected Issues</h3>
          <div className="space-y-4">
            {quantumExposure.issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-700">{issue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {quantumExposure.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                <span className="text-green-500">✓</span>
                <p className="text-green-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">PQC Controls</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Control ID
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standard
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finding
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quantumExposure.pqcControls.map((control) => (
                <tr key={control.controlId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {control.controlId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{control.title}</div>
                    <div className="text-gray-500">{control.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      control.severity === "High" 
                        ? "bg-red-100 text-red-800"
                        : control.severity === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {control.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {control.pqcStandard}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {control.finding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default QuantumSecurity;
