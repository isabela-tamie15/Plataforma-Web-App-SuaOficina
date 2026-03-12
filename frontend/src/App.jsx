import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Super Admin pages
import SuperAdminLogin from './pages/super-admin/Login';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import OficinasList from './pages/super-admin/OficinasList';
import OficinaCreate from './pages/super-admin/OficinaCreate';

// Oficina pages
import OficinaLogin from './pages/oficina/Login';
import OficinaDashboard from './pages/oficina/Dashboard';

// Layout
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';

const SuperAdminLayout = () => {
  const menuItems = [
    { path: '/super-admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/super-admin/oficinas', label: 'Oficinas', icon: '🏪' },
    { path: '/super-admin/usuarios', label: 'Usuários Admin', icon: '👥' },
    { path: '/super-admin/configuracoes', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar menuItems={menuItems} />
      <div className="dashboard-main">
        <TopBar title="Super Admin" />
        <main className="dashboard-content">
          <Routes>
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="oficinas" element={<OficinasList />} />
            <Route path="oficinas/nova" element={<OficinaCreate />} />
            {/* Futuras rotas aqui */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

const OficinaLayout = () => {
  const menuItems = [
    { path: '/oficina/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/oficina/clientes', label: 'Clientes', icon: '👥' },
    { path: '/oficina/veiculos', label: 'Veículos', icon: '🚗' },
    { path: '/oficina/ordens-de-servico', label: 'Ordens de Serviço', icon: '📋' },
    { path: '/oficina/agenda', label: 'Agenda do Dia', icon: '📅' },
    { path: '/oficina/historico', label: 'Histórico', icon: '📜' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar menuItems={menuItems} />
      <div className="dashboard-main">
        <TopBar title="Painel da Oficina" />
        <main className="dashboard-content">
          <Routes>
            <Route path="dashboard" element={<OficinaDashboard />} />
            {/* Futuras rotas aqui */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/super-admin/login" replace />} />

          {/* Super Admin */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route
            path="/super-admin/*"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Oficina */}
          <Route path="/oficina/login" element={<OficinaLogin />} />
          <Route
            path="/oficina/*"
            element={
              <ProtectedRoute allowedRoles={['oficina_admin', 'oficina_user']}>
                <OficinaLayout />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/super-admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
