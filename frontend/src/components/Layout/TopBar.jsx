import { useAuth } from '../../contexts/AuthContext';

const TopBar = ({ title = '' }) => {
  const { profile } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{title}</h2>
      </div>
      <div className="topbar-right">
        <span className="topbar-greeting">
          Olá, <strong>{profile?.nome?.split(' ')[0] || 'Usuário'}</strong>
        </span>
        <div className="topbar-avatar">
          {profile?.nome?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
