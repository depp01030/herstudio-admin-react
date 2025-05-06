// src/routes/RequireAuth.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/config/constants';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return null; // ⏳ 或顯示 <Loading /> 畫面
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
