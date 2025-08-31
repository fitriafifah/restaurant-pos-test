// src/components/RoleGuard.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/auth';

interface RoleGuardProps {
  role: 'pelayan' | 'kasir';
  children: ReactNode;
}

export default function RoleGuard({ role, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
