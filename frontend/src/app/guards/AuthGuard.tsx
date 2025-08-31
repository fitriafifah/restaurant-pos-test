import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../stores/auth';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { token } = useAuth();
  const loc = useLocation();

  if (!token) {
    // Kalau belum login → redirect ke /login dan simpan lokasi asal
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  // Sudah login → render children
  return <>{children}</>;
}
