// src/context/ScanContext.jsx

import { createContext, useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import toast from "react-hot-toast";

export const ScanContext = createContext();

export function ScanProvider({ children }) {
  const auth = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);

  const extractDomain = (email) => {
    if (!email || !email.includes("@")) return null;
    return email.split("@")[1];
  };

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('scanData');
    if (savedData) {
      try {
        const { result, timestamp } = JSON.parse(savedData);
        setScanResult(result);
        setLastScanTime(timestamp);
      } catch (error) {
        console.error('Error loading saved scan data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (scanResult && lastScanTime) {
      try {
        localStorage.setItem('scanData', JSON.stringify({
          result: scanResult,
          timestamp: lastScanTime
        }));
      } catch (error) {
        console.error('Error saving scan data:', error);
      }
    }
  }, [scanResult, lastScanTime]);

  // Get module-specific data with proper error handling
  const getModuleData = (moduleName) => {
    try {
      if (!scanResult) {
        console.warn(`No scan result found`);
        return null;
      }

      console.log('Full scan result in getModuleData:', scanResult);

      // Direct handling based on the requested module
      switch(moduleName) {
        case 'spf':
          console.log('Looking for SPF security data in:', scanResult);
          return scanResult.spfSecurity || null;
        case 'dkim':
          console.log('Looking for DKIM security data in:', scanResult);
          return scanResult.dkimSecurity || null;
        case 'dmarc':
          console.log('Looking for DMARC security data in:', scanResult);
          return scanResult.dmarcSecurity || null;
        default:
          // For other modules, use groupedResults
          if (!scanResult.groupedResults) {
            console.warn(`No groupedResults found in scanResult:`, scanResult);
            return null;
          }
          
          const moduleData = scanResult.groupedResults?.[moduleName];
          if (!moduleData) {
            console.warn(`No data found for module: ${moduleName}`);
            return null;
          }

          return moduleData;
      }
    } catch (error) {
      console.error(`Error getting data for module ${moduleName}:`, error);
      return null;
    }
  };

  // Check if a specific module has errors with proper validation
  const hasModuleErrors = (moduleName) => {
    try {
      const moduleData = getModuleData(moduleName);
      if (!moduleData) return false;

      // For quantum security, check specific error conditions
      if (moduleName === 'quantumSecurity') {
        const mainDomain = Object.values(moduleData).find(
          (domain) => !domain.error && domain.quantumExposure
        );
        return mainDomain?.quantumExposure?.isQuantumVulnerable || false;
      }

      // For other modules
      return Object.values(moduleData).some(control => control?.error);
    } catch (error) {
      console.error(`Error checking errors for module ${moduleName}:`, error);
      return false;
    }
  };

  // Get last scan information with validation
  const getLastScanInfo = () => {
    if (!scanResult) return null;
    
    return {
      domain: scanResult.domain,
      time: lastScanTime,
    };
  };

  // Update the data processing in fetchLastScanResult and startNewScan
  const processReportData = (report, domain, timestamp) => {
    console.log('Raw API response in processReportData:', report.data);
    
    // Keep the original data structure, just add metadata
    const processedData = {
      ...report.data,
      scanTime: timestamp || new Date().toISOString(),
      domain: domain,
      // Ensure security groups are preserved at the top level
      spfSecurity: report.data.spfSecurity,
      dkimSecurity: report.data.dkimSecurity,
      dmarcSecurity: report.data.dmarcSecurity
    };

    // Initialize groupedResults if needed for other modules
    if (!processedData.groupedResults) {
      processedData.groupedResults = {};
    }

    console.log('Processed scan data:', processedData);
    return processedData;
  };

  const fetchLastScanResult = async (domain) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`https://apex.allsecurex.com/api/fullScan/latest/${domain}`);
      
      if (response.data && response.data.scanId) {
        const report = await axios.post(`https://apex.allsecurex.com/api/fullScan/report/${response.data.scanId}`);
        const processedData = processReportData(report, domain, response.data.timestamp);
        setScanResult(processedData);
        setLastScanTime(response.data.timestamp || new Date().toISOString());
      } else {
        setScanResult(null);
        setLastScanTime(null);
        localStorage.removeItem('scanData');
      }
    } catch (error) {
      console.error("Error fetching last scan:", error);
      setError("Failed to fetch scan results. Please try starting a new scan.");
      toast.error("❌ Failed to fetch scan results");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch last scan result when user is authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.profile?.email) {
      const domain = extractDomain(auth.user.profile.email);
      if (domain && !scanResult) {
        fetchLastScanResult(domain);
      }
    }
  }, [auth.isAuthenticated, auth.user?.profile?.email]);

  const startNewScan = async () => {
    const domain = extractDomain(auth.user?.profile?.email);
    
    if (!domain) {
      const error = "Cannot extract domain from email address.";
      setError(error);
      toast.error(`❌ ${error}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setScanResult(null);
      localStorage.removeItem('scanData');
      toast.loading(`🚀 Starting scan for ${domain}`, { id: "scan" });

      const res = await axios.post(`https://apex.allsecurex.com/api/fullScan/scan`, { domain });
      console.log('Scan initiated response:', res.data);
      const scanId = res.data.scanId;

      let retries = 0;
      const maxRetries = 20;

      const interval = setInterval(async () => {
        try {
          if (retries >= maxRetries) {
            clearInterval(interval);
            throw new Error("Scan timed out. Please try again.");
          }

          const status = await axios.get(`https://apex.allsecurex.com/api/fullScan/status/${scanId}`);
          console.log('Scan status:', status.data);
          
          if (status.data.status === "completed") {
            clearInterval(interval);
            const report = await axios.get(`https://apex.allsecurex.com/api/fullScan/report/${scanId}`);
            console.log('Raw scan report:', report.data);
            
            const processedData = processReportData(report, domain, new Date().toISOString());
            console.log('Setting scan result to:', processedData);
            setScanResult(processedData);
            setLastScanTime(new Date().toISOString());
            toast.success("✅ Scan completed successfully!", { id: "scan" });
            setLoading(false);
          } else if (status.data.status === "failed") {
            clearInterval(interval);
            throw new Error("Scan failed. Please try again.");
          }
          
          retries++;
        } catch (error) {
          clearInterval(interval);
          setError(error.message);
          toast.error(`❌ ${error.message}`, { id: "scan" });
          setLoading(false);
        }
      }, 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to start scan.";
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`, { id: "scan" });
      setLoading(false);
    }
  };

  return (
    <ScanContext.Provider
      value={{
        scanResult,
        loading,
        error,
        startNewScan,
        getModuleData,
        hasModuleErrors,
        getLastScanInfo,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}
