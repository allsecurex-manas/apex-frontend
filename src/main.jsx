import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import App from "./App";
import "./index.css";

const oidcConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_eYMv9KL76", // ✅ Corrected!
  client_id: "2gnqpuoqn91kdlr71o613p6hbn",
  redirect_uri: "https://apex.allsecurex.com",
  response_type: "code",
  scope: "openid email profile",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
