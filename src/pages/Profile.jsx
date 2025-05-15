// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const idToken = sessionStorage.getItem("id_token");
    if (idToken) {
      try {
        const decoded = jwtDecode(idToken);
        setUserInfo(decoded);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  if (!userInfo) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">No user information available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">👤 User Profile</h1>

      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <p className="mb-4"><strong>Username:</strong> {userInfo["cognito:username"]}</p>
        <p className="mb-4"><strong>Email:</strong> {userInfo.email}</p>
        <p className="mb-4"><strong>Issued At:</strong> {new Date(userInfo.iat * 1000).toLocaleString()}</p>
        <p className="mb-4"><strong>Expires At:</strong> {new Date(userInfo.exp * 1000).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default Profile;
