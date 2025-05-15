// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const idToken = sessionStorage.getItem('id_token');

  if (!idToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
