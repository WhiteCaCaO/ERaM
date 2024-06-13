import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !alertShown) {
      alert("로그인이 필요합니다");
      setAlertShown(true);
    }
  }, [isAuthenticated, alertShown]);

  if (!isAuthenticated && alertShown) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

export default PrivateRoute;