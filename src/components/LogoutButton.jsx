// src/components/LogoutButton.jsx

function LogoutButton() {
  const handleLogout = () => {
    const clientId = "5mu1v00cuedvsp7hrl7acmlpa3"; // 👈 Your real App Client ID
    const domain = "ap-south-1eymv9kl76.auth.ap-south-1.amazoncognito.com"; // 👈 Your real Cognito domain
    const redirectUri = "https://apex.allsecurex.com"; // 👈 Redirect user after logout

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
