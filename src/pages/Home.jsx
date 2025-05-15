// src/pages/Home.jsx

function Home() {
  return (
    <div className="bg-white text-gray-900">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Secure Your Business with <span className="text-yellow-300">Apex Security</span> 🚀
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Apex provides enterprise-grade cyber security, quantum safety, and full-stack risk protection. 
          Built for the future. Ready for now.
        </p>
        <a href="/signup">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-4 rounded-full shadow-md transition">
            Get Started
          </button>
        </a>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">What We Offer 🔥</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-4">Quantum-Safe Security</h3>
              <p>Prepare for quantum attacks with post-quantum cryptography and PKI modernization.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-4">Full Risk Analysis</h3>
              <p>AI-powered cybersecurity scans across your domains, apps, APIs, and cloud environments.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-4">Zero Trust Monitoring</h3>
              <p>Real-time detection, full event visibility, and autonomous attack surface reduction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How Apex Works ⚡</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h4 className="text-2xl font-semibold mb-2">1. Sign Up</h4>
                <p>Create your secure account and set your organization’s domain for instant scans.</p>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-2">2. Security Assessment</h4>
                <p>Launch a full-stack scan and get detailed reports on vulnerabilities and risk exposure.</p>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-2">3. Real-time Monitoring</h4>
                <p>Continuously monitor your attack surface and receive live alerts for any threat detected.</p>
              </div>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1605902711622-cfb43c44367f?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80" 
                   alt="Cybersecurity Illustration" 
                   className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Business?</h2>
          <p className="text-lg mb-8">
            Join hundreds of organizations using Apex Security to stay protected against modern threats.
          </p>
          <a href="/signup">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-4 rounded-full transition">
              Start Free Security Scan
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} Apex Security. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
