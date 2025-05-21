// src/components/LogoutButton.jsx

function LogoutButton() {
  const handleLogout = () => {
    const clientId = "5v74q9ljb7476b0nofe8sq23c8"; // 👈 Your real App Client ID
    const domain = "ap-south-1eymv9kl76.auth.ap-south-1.amazoncognito.com"; // 👈 Your real Cognito domain
    const redirectUri = "http://localhost:5173/"; // 👈 Redirect user after logout

    const logoutUrl = `https://${domain}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;

    // Clear local storage/sessionStorage
    sessionStorage.clear();

    // Redirect to Cognito logout
    window.location.href = logoutUrl;
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      🚪 Logout
    </button>
  );
}

export default LogoutButton;
