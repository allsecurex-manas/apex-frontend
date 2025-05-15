import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const auth = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const userName = auth.user?.profile?.email || "User";
  const userDomain = userName.split("@")[1]; // 👈 Extract domain from email

  useEffect(() => {
    if (auth.isAuthenticated && userDomain) {
      startScan(userDomain);
    }
  }, [auth.isAuthenticated, userDomain]);

  const startScan = async (domain) => {
    try {
      setLoading(true);
      toast.loading(`Starting scan for ${domain}...`, { id: "scan" });

      const response = await axios.post("https://apex.allsecurex.com/api/fullScan/scan", {
        domain: domain.trim(),
      });

      const scanId = response.data.scanId;

      // Polling for scan status
      const interval = setInterval(async () => {
        try {
          const statusRes = await axios.get(`https://apex.allsecurex.com/api/fullScan/status/${scanId}`);

          if (statusRes.data.status === "completed") {
            clearInterval(interval);

            const reportRes = await axios.get(`https://apex.allsecurex.com/api/fullScan/report/${scanId}`);
            setScanResult(reportRes.data);

            toast.success(`✅ Scan completed for ${domain}`, { id: "scan" });
            setLoading(false);
          }
        } catch (err) {
          console.error("❌ Error checking scan status:", err);
          clearInterval(interval);
          toast.error('❌ Failed to check scan status.', { id: "scan" });
          setLoading(false);
        }
      }, 3000);
    } catch (error) {
      console.error("❌ Error starting scan:", error);
      toast.error('❌ Failed to start scan.', { id: "scan" });
      setLoading(false);
    }
  };

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

  const downloadJSONReport = () => {
    if (!scanResult) return;

    const blob = new Blob([JSON.stringify(scanResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `apex-security-report-${userDomain}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("📥 JSON Report Downloaded!");
  };

  const downloadPDFReport = () => {
    if (!scanResult) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Security Report</title></head><body>");
      printWindow.document.write("<h1>Apex Security Report</h1>");
      printWindow.document.write("<pre>" + JSON.stringify(scanResult, null, 2) + "</pre>");
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();

      toast.success("📄 PDF Report Ready!");
    }
  };

  if (auth.isLoading) return <div>Loading...</div>;

  if (!auth.isAuthenticated) return <div>Please login to access the dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
      <Toaster position="top-center" />

      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Welcome, {userName.split("@")[0]} 🚀
      </h1>

      {loading && (
        <p className="text-yellow-500 text-xl mb-6">
          ⏳ Scan in progress for {userDomain}...
        </p>
      )}

      {scanResult && (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Security Grade: <span className="text-green-600">{calculateSecurityGrade(scanResult)}</span>
          </h2>

          <div className="flex gap-4 mb-8">
            <button
              onClick={downloadJSONReport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              📥 Download JSON
            </button>
            <button
              onClick={downloadPDFReport}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              📄 Download PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {Object.keys(scanResult.groupedResults).map((moduleName, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-500 mb-2">
                  {moduleName.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <p className={scanResult.groupedResults[moduleName][Object.keys(scanResult.groupedResults[moduleName])[0]]?.error ? "text-red-500" : "text-green-600"}>
                  {scanResult.groupedResults[moduleName][Object.keys(scanResult.groupedResults[moduleName])[0]]?.error ? "❌ Issue Found" : "✅ Secured"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
