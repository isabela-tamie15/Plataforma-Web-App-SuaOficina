import { useAuth } from '../../contexts/AuthContext';

const SuperAdminDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="welcome-card">
        <div className="welcome-card-content">
          <h2 className="welcome-title">
            Bem-vindo ao Painel Super Admin 🎉
          </h2>
          <p className="welcome-text">
            Olá, <strong>{profile?.nome}</strong>! Você está logado como Super Administrador da plataforma SuaOficina.
          </p>
          <div className="welcome-info">
            <p>Em breve, aqui você poderá:</p>
            <ul>
              <li>📊 Visualizar métricas consolidadas da plataforma</li>
              <li>🏪 Cadastrar e gerenciar oficinas</li>
              <li>👥 Gerenciar usuários administradores</li>
              <li>⚙️ Configurar parâmetros globais do sistema</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">Oficinas Ativas</span>
          </div>
        </div>
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
            <span className="stat-label">Clientes Cadastrados</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-value">—</span>
            <span className="stat-label">Atividade Recente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
