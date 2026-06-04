import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../utils/roles';

/**
 * Role-gated route/layout wrapper.
 *   <RoleRoute allow={['ADMIN']} redirectTo="/admin/login"><AdminLayout/></RoleRoute>
 * Unauthenticated -> redirectTo (the portal's login).
 * Wrong role -> that user's own home area.
 */
export default function RoleRoute({ allow = [], redirectTo = '/customer/login', children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  if (allow.length > 0 && !allow.includes(role)) {
    return <Navigate to={homeForRole(role)} replace />;
  }
  return children;
}
