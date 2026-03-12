import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Não autenticado → redirecionar para login
  if (!isAuthenticated || !profile) {
    // Determinar para qual login redirecionar baseado na URL atual
    const path = window.location.pathname;
    if (path.startsWith('/super-admin')) {
      return <Navigate to="/super-admin/login" replace />;
    }
    if (path.startsWith('/oficina')) {
      return <Navigate to="/oficina/login" replace />;
    }
    return <Navigate to="/super-admin/login" replace />;
  }

  // Verificar role
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    // Redirecionar para o dashboard do role correto
    switch (profile.role) {
      case 'super_admin':
        return <Navigate to="/super-admin/dashboard" replace />;
      case 'oficina_admin':
      case 'oficina_user':
        return <Navigate to="/oficina/dashboard" replace />;
      case 'cliente':
        return <Navigate to="/cliente/inicio" replace />;
      default:
        return <Navigate to="/super-admin/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
