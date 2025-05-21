// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { ScanProvider } from "./context/ScanContext"; // 👈 Correct import
import App from "./App";
import "./index.css"; // Import the main CSS file with Tailwind directives
import "./tailwind-fix.css"; // Import the CSS fixes

// Cognito auth configuration
const authConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_eYMv9KL76",
  client_id: "5v74q9ljb7476b0nofe8sq23c8",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid profile",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

// Render our application with all providers
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider {...authConfig}>
      <ScanProvider> {/* 🛡️ Security context provider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ScanProvider>
    </AuthProvider>
  </React.StrictMode>
);
