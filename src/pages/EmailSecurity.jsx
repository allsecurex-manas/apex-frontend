// src/pages/EmailSecurity.jsx

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
} from "recharts";

const SEVERITY_COLORS = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#10B981",
  Informational: "#3B82F6",
};

const CHART_COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

// Custom styles
const styles = {
  emailControl: `bg-[#f8fafc] rounded-lg p-4 mb-4 border-l-4 border-blue-500`,
  emailControlHeader: `flex justify-between items-center mb-2`,
  emailControlTitle: `font-semibold text-blue-800`,
  statusBadge: `inline-block px-2 py-1 rounded text-xs font-semibold`,
  statusConfigured: `bg-green-100 text-green-800`,
  statusMissing: `bg-red-100 text-red-800`,
  statusPartial: `bg-yellow-100 text-yellow-800`,
  controlDetails: `mt-2 text-sm`,
  controlExplanation: `mt-2 p-3 bg-gray-100 rounded text-sm`,
  recommendation: `mt-3 p-3 bg-blue-50 rounded border-l-3 border-blue-600`,
  findingsContainer: `mt-4`,
  sectionHeader: `mb-4`,
};

function EmailSecurity() {
  const { scanResult, loading, getModuleData, hasModuleErrors, getLastScanInfo, startNewScan } = useContext(ScanContext);
  const lastScan = getLastScanInfo();

  // Get all email security related data
  const spfData = getModuleData("spfSecurity");
  const dmarcData = getModuleData("dmarcSecurity");
  const dkimData = getModuleData("dkimSecurity");

  // Prepare chart data
  const prepareChartData = useMemo(() => {
    if (!spfData || !dmarcData || !dkimData) return null;

    try {
      // Get main domain data
      const mainDomain = Object.keys(spfData).find(domain => !domain.startsWith('*'));
      if (!mainDomain) return null;

      // Combine all findings
      const allFindings = [
        ...(spfData[mainDomain]?.findings || []),
        ...(dmarcData[mainDomain]?.findings || []),
        ...(dkimData[mainDomain]?.findings || []),
      ];

      // Severity distribution
      const severityData = allFindings.reduce((acc, finding) => {
        acc[finding.severity] = (acc[finding.severity] || 0) + 1;
        return acc;
      }, {});

      const pieData = Object.entries(severityData).map(([severity, count]) => ({
        name: severity,
        value: count,
      }));

      // Control distribution
      const controlData = {
        SPF: spfData[mainDomain]?.findings?.length || 0,
        DMARC: dmarcData[mainDomain]?.findings?.length || 0,
        DKIM: dkimData[mainDomain]?.findings?.length || 0,
      };

      const barData = Object.entries(controlData).map(([control, count]) => ({
        name: control,
        Issues: count,
      }));

      return {
        pieData,
        barData,
        mainDomain,
        allFindings,
        records: {
          spf: spfData[mainDomain]?.rawSPFRecord,
          dmarc: dmarcData[mainDomain]?.rawDMARCRecord,
          dkim: dkimData[mainDomain]?.rawDKIMRecord,
        },
      };
    } catch (error) {
      console.error("Error preparing email security chart data:", error);
      return null;
    }
  }, [spfData, dmarcData, dkimData]);

  const handleStartScan = async () => {
    try {
      await startNewScan();
    } catch (error) {
      toast.error("Failed to start the scan. Please try again.");
    }
  };

  // Calculate overall security score
  const calculateSecurityScore = () => {
    if (!prepareChartData) return 0;
    const { records } = prepareChartData;
    let score = 0;
    if (records.spf) score += 33.33;
    if (records.dmarc) score += 33.33;
    if (records.dkim) score += 33.34;
    return Math.round(score);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="main-content">
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="animate-spin text-6xl mb-6">📧</div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Analyzing Email Security</h3>
            <p className="text-gray-600">Checking SPF, DKIM, and DMARC configurations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!scanResult || !prepareChartData) {
    return (
      <div className="page-wrapper">
        <div className="main-content">
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-6">📧</div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">No Email Security Data</h3>
            <p className="text-gray-600 mb-8">Start a new scan to analyze email security posture.</p>
            <button
              onClick={handleStartScan}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start New Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { pieData, barData, mainDomain, allFindings, records } = prepareChartData;
  const securityScore = calculateSecurityScore();

  return (
    <div className="page-wrapper">
      <button className="sidebar-toggle" id="sidebarToggle" title="Toggle Sidebar">
        <i className="fas fa-bars"></i>
      </button>

      <div className="main-content">
        <Toaster position="top-center" />

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-blue-700 flex items-center gap-2">
                📧 Email Security
                {allFindings.length > 0 && (
                  <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    {allFindings.length} Issues Found
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">
                Email Authentication and Protection for {lastScan?.domain || mainDomain}
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

        {/* Security Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={styles.emailControl}>
            <div className={styles.emailControlHeader}>
              <h3 className={styles.emailControlTitle}>SPF Status</h3>
              <span className={`${styles.statusBadge} ${records.spf ? styles.statusConfigured : styles.statusMissing}`}>
                {records.spf ? "Configured" : "Missing"}
              </span>
            </div>
            <div className={styles.controlDetails}>
              <code className="text-sm break-all">{records.spf || "No SPF record found"}</code>
            </div>
            <div className={styles.controlExplanation}>
              SPF allows domain owners to specify which mail servers are authorized to send email on behalf of their domain.
            </div>
            {!records.spf && (
              <div className={styles.recommendation}>
                <strong>Recommendation:</strong> Configure SPF by adding a TXT record to your DNS with the format: v=spf1 include:_spf.your-mail-provider.com ~all
              </div>
            )}
          </div>

          <div className={styles.emailControl}>
            <div className={styles.emailControlHeader}>
              <h3 className={styles.emailControlTitle}>DKIM Status</h3>
              <span className={`${styles.statusBadge} ${records.dkim ? styles.statusConfigured : styles.statusMissing}`}>
                {records.dkim ? "Configured" : "Missing"}
              </span>
            </div>
            <div className={styles.controlDetails}>
              <code className="text-sm break-all">{records.dkim || "No DKIM record found"}</code>
            </div>
            <div className={styles.controlExplanation}>
              DKIM adds a digital signature to emails, allowing receiving servers to verify that the email was not altered in transit.
            </div>
            {!records.dkim && (
              <div className={styles.recommendation}>
                <strong>Recommendation:</strong> Configure DKIM by generating key pairs and adding the public key as a DNS TXT record.
              </div>
            )}
          </div>

          <div className={styles.emailControl}>
            <div className={styles.emailControlHeader}>
              <h3 className={styles.emailControlTitle}>DMARC Status</h3>
              <span className={`${styles.statusBadge} ${records.dmarc ? styles.statusConfigured : styles.statusMissing}`}>
                {records.dmarc ? "Configured" : "Missing"}
              </span>
            </div>
            <div className={styles.controlDetails}>
              <code className="text-sm break-all">{records.dmarc || "No DMARC record found"}</code>
            </div>
            <div className={styles.controlExplanation}>
              DMARC tells receiving mail servers what to do if an email fails SPF or DKIM authentication checks.
            </div>
            {!records.dmarc && (
              <div className={styles.recommendation}>
                <strong>Recommendation:</strong> Set up DMARC to define how receiving servers should handle failed SPF/DKIM checks.
              </div>
            )}
          </div>

          <div className={styles.emailControl}>
            <div className={styles.emailControlHeader}>
              <h3 className={styles.emailControlTitle}>Overall Score</h3>
              <span className={`${styles.statusBadge} ${
                securityScore >= 75 ? styles.statusConfigured :
                securityScore >= 50 ? styles.statusPartial :
                styles.statusMissing
              }`}>
                {securityScore}/100
              </span>
            </div>
            <div className={styles.controlExplanation}>
              Combined security score based on the implementation of SPF, DKIM, and DMARC protocols.
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Severity Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Issue Severity Distribution</h3>
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

          {/* Issues by Protocol */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Issues by Protocol</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Issues" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Findings Table */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Detailed Findings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Control ID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Control Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observation
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potential Attacks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allFindings.map((finding, index) => (
                  <tr key={`${finding.controlId}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {finding.controlId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {finding.controlName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        finding.severity === "High" 
                          ? "bg-red-100 text-red-800"
                          : finding.severity === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : finding.severity === "Low"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {finding.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {finding.observation}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {finding.potentialAttacks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Raw Data Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <button
            onClick={() => {
              const rawDataContainer = document.getElementById('rawDataContainer');
              if (rawDataContainer) {
                rawDataContainer.style.display = 
                  rawDataContainer.style.display === 'none' ? 'block' : 'none';
              }
            }}
            className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Toggle Raw Data
          </button>
          <div id="rawDataContainer" className="hidden">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(prepareChartData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailSecurity;
