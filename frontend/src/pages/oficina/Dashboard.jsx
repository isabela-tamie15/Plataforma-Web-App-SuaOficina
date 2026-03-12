import { useAuth } from '../../contexts/AuthContext';

const OficinaDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="welcome-card welcome-card--oficina">
        <div className="welcome-card-content">
          <h2 className="welcome-title">
            Bem-vindo à sua Oficina 🏪
          </h2>
          <p className="welcome-text">
            Olá, <strong>{profile?.nome}</strong>! Você está no painel de gestão da sua oficina.
          </p>
          <div className="welcome-info">
            <p>Em breve, aqui você poderá:</p>
            <ul>
              <li>👥 Cadastrar e gerenciar clientes</li>
              <li>🚗 Cadastrar veículos</li>
              <li>📋 Abrir e gerenciar ordens de serviço</li>
              <li>📅 Acompanhar a agenda do dia</li>
              <li>📜 Consultar histórico de serviços</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">OS Abertas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">Clientes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">Veículos</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">OS Finalizadas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OficinaDashboard;
