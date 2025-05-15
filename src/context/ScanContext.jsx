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

  // Function to fetch the last scan result
  const fetchLastScanResult = async (domain) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`https://apex.allsecurex.com/api/fullScan/latest/${domain}`);
      
      if (response.data && response.data.scanId) {
        const report = await axios.get(`https://apex.allsecurex.com/api/fullScan/report/${response.data.scanId}`);
        
        // Process and structure the data
        const processedData = {
          ...report.data,
          scanTime: response.data.timestamp || new Date().toISOString(),
          domain: domain,
        };
        
        // Ensure the data structure is correct
        if (!processedData.groupedResults) {
          processedData.groupedResults = {};
        }

        // Add default structure for quantum security if not present
        if (!processedData.groupedResults.quantumSecurity) {
          processedData.groupedResults.quantumSecurity = {};
        }

        setScanResult(processedData);
        setLastScanTime(response.data.timestamp || new Date().toISOString());
      } else {
        // If no previous scan exists, start a new one
        await startNewScan();
      }
    } catch (error) {
      console.error("Error fetching last scan:", error);
      // If we can't fetch the last scan, start a new one
      await startNewScan();
    } finally {
      setLoading(false);
    }
  };

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
      setScanResult(null); // Clear previous results
      toast.loading(`🚀 Starting scan for ${domain}`, { id: "scan" });

      const res = await axios.post(`https://apex.allsecurex.com/api/fullScan/scan`, { domain });
      const scanId = res.data.scanId;

      let retries = 0;
      const maxRetries = 20; // 1 minute timeout (3s * 20)

      // Polling with timeout and retry logic
      const interval = setInterval(async () => {
        try {
          if (retries >= maxRetries) {
            clearInterval(interval);
            throw new Error("Scan timed out. Please try again.");
          }

          const status = await axios.get(`https://apex.allsecurex.com/api/fullScan/status/${scanId}`);
          
          if (status.data.status === "completed") {
            clearInterval(interval);
            const report = await axios.get(`https://apex.allsecurex.com/api/fullScan/report/${scanId}`);
            
            // Process and structure the data
            const processedData = {
              ...report.data,
              scanTime: new Date().toISOString(),
              domain: domain,
            };
            
            // Ensure the data structure is correct
            if (!processedData.groupedResults) {
              processedData.groupedResults = {};
            }

            // Add default structure for quantum security if not present
            if (!processedData.groupedResults.quantumSecurity) {
              processedData.groupedResults.quantumSecurity = {};
            }

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

  // Get module-specific data with proper error handling
  const getModuleData = (moduleName) => {
    try {
      if (!scanResult?.groupedResults) return null;
      
      const moduleData = scanResult.groupedResults[moduleName];
      if (!moduleData) {
        console.warn(`No data found for module: ${moduleName}`);
        return null;
      }

      // For quantum security, ensure we return the correct structure
      if (moduleName === 'quantumSecurity') {
        // Find the main domain data (non-wildcard)
        const mainDomainData = Object.entries(moduleData).find(([key, value]) => 
          !key.startsWith('*') && !value.error
        );
        
        if (mainDomainData) {
          return {
            [mainDomainData[0]]: mainDomainData[1],
            ...moduleData
          };
        }
      }

      return moduleData;
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
    if (!lastScanTime || !scanResult?.domain) return null;
    return {
      time: lastScanTime,
      domain: scanResult.domain || extractDomain(auth.user?.profile?.email),
    };
  };

  // Fetch last scan result when authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.profile?.email && !scanResult && !loading) {
      const domain = extractDomain(auth.user?.profile?.email);
      if (domain) {
        fetchLastScanResult(domain);
      }
    }
  }, [auth.isAuthenticated, auth.user]);

  return (
    <ScanContext.Provider 
      value={{ 
        scanResult, 
        startNewScan, 
        loading, 
        error,
        getModuleData,
        hasModuleErrors,
        getLastScanInfo,
        lastScanTime
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}
