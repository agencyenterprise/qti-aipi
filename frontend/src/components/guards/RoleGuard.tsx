import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface RoleGuardProps {
  role: 'TEACHER' | 'STUDENT';
}

const RoleGuard: React.FC<RoleGuardProps> = ({ role }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || user.role !== role) {
    return <Navigate to={`/${user?.role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
};

export default RoleGuard; 