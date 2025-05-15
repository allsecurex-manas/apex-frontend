import LoginButton from "../components/LoginButton";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Login to Apex Security 🚀</h1>
      <LoginButton />
    </div>
  );
}

export default Login;
