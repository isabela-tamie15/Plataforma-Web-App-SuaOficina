import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ menuItems = [] }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    if (profile?.role === 'super_admin') {
      navigate('/super-admin/login');
    } else {
      navigate('/oficina/login');
    }
  };

  const roleLabel = {
    super_admin: 'Super Admin',
    oficina_admin: 'Admin da Oficina',
    oficina_user: 'Usuário',
    cliente: 'Cliente',
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🔧</span>
          <h1 className="logo-text">SuaOficina</h1>
        </div>
        <span className="sidebar-role-badge">{roleLabel[profile?.role] || 'Usuário'}</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">
            {profile?.nome?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-details">
            <span className="sidebar-user-name">{profile?.nome || 'Usuário'}</span>
            <span className="sidebar-user-email">{profile?.email}</span>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout} title="Sair">
          ⬅ Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
