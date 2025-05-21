// src/pages/Profile.jsx

import { useAuth } from "react-oidc-context";
import { useContext, useState, useEffect } from "react";
import { ScanContext } from "../context/ScanContext"; // ✅ Context to share scan results
import { Toaster } from "react-hot-toast";

function Profile() {
  const auth = useAuth();
  const { scanResult } = useContext(ScanContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay for transition effects
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const userName = auth.user?.profile?.email || "User";
  const userDomain = userName.split("@")[1];
  const firstName = auth.user?.profile?.given_name || userName.split("@")[0];
  const lastName = auth.user?.profile?.family_name || "";
  const lastScanTime = scanResult?.timestamp || "Not Available";

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

  const securityGrade = calculateSecurityGrade(scanResult);
  
  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 md:p-8 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-center" />

      <div className={`max-w-4xl mx-auto transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mr-5 shadow-md">
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {firstName}'s Profile
            </h1>
            <p className="text-gray-600">Manage your account and view security status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">Account Info</h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Name</span>
                <p className="font-medium text-gray-900">{firstName} {lastName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="font-medium text-gray-900">{userName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Domain</span>
                <p className="font-medium text-gray-900">{userDomain}</p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">Security Status</h2>
            </div>
            <div className="flex flex-col items-center justify-center h-32">
              <div className={`text-4xl font-bold ${getGradeColor(securityGrade)} w-20 h-20 rounded-full flex items-center justify-center mb-2`}>
                {securityGrade}
              </div>
              <p className="text-gray-600 text-sm">Security Grade</p>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">Last Activity</h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Last Scan</span>
                <p className="font-medium text-gray-900">{lastScanTime}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Scan Status</span>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <p className="font-medium text-gray-900">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center mb-6">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className="text-lg font-bold text-gray-800">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Security Alerts</p>
                <p className="text-sm text-gray-600">Get notified when security issues are detected</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input type="checkbox" id="toggle-1" defaultChecked className="sr-only" />
                <label htmlFor="toggle-1" className="toggle-bg block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Receive weekly security summary reports</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input type="checkbox" id="toggle-2" defaultChecked className="sr-only" />
                <label htmlFor="toggle-2" className="toggle-bg block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Product Updates</p>
                <p className="text-sm text-gray-600">Stay informed about new features</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input type="checkbox" id="toggle-3" className="sr-only" />
                <label htmlFor="toggle-3" className="toggle-bg block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`flex justify-end transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
