import generatePKCE from '../utils/pkceUtils';

function LoginButton() {
  const handleLogin = async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE();

    sessionStorage.setItem("pkce_code_verifier", codeVerifier); // ✅ Save

    const clientId = "2gnqpuoqn91kdlr71o613p6hbn"; 
    const domain = "ap-south-1eymv9kl76.auth.ap-south-1.amazoncognito.com";
    const redirectUri = "https://apex.allsecurex.com";

    const loginUrl = `https://${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email+openid+profile&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    window.location.href = loginUrl;
  };

  return (
    <button onClick={handleLogin} className="bg-blue-500 px-4 py-2 text-white rounded">
      Login to Apex
    </button>
  );
}

export default LoginButton;
