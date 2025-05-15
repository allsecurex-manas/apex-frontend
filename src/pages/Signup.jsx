import SignupButton from "../components/SignupButton";

function Signup() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Create your Apex Account 🚀</h1>
      <SignupButton />
    </div>
  );
}

export default Signup;
