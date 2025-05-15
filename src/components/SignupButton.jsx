// src/components/SignupButton.jsx
function SignupButton() {
  const handleSignup = () => {
    const domain = "ap-south-1eymv9kl76.auth.ap-south-1.amazoncognito.com"; // e.g., your-app-name.auth.ap-south-1.amazoncognito.com
    const clientId = "5mu1v00cuedvsp7hrl7acmlpa3"; // App client ID
    const redirectUri = "https://apex.allsecurex.com"; // ✅ After signup, where to redirect
    const signupUrl = `https://${domain}/signup?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;

    window.location.href = signupUrl;
  };

  return (
    <button 
      onClick={handleSignup} 
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    >
      Sign Up with Apex
    </button>
  );
}

export default SignupButton;
