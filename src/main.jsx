// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { ScanProvider } from "./context/ScanContext"; // 👈 Correct import
import App from "./App";

const authConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_eYMv9KL76",
  client_id: "2gnqpuoqn91kdlr71o613p6hbn",
  redirect_uri: "https://apex.allsecurex.com",
  response_type: "code",
  scope: "email openid profile",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider {...authConfig}>
      <ScanProvider> {/* 🛡️ WRAP WHOLE APP HERE */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ScanProvider>
    </AuthProvider>
  </React.StrictMode>
);
