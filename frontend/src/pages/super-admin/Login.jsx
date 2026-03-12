import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();

  // Se já está logado como super_admin, redireciona
  if (isAuthenticated && profile?.role === 'super_admin') {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.profile.role !== 'super_admin') {
        setError('Acesso negado. Esta área é exclusiva para Super Admins.');
        setIsLoading(false);
        return;
      }

      navigate('/super-admin/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page login-page--admin">
      <div className="login-bg-effects">
        <div className="login-bg-circle login-bg-circle--1"></div>
        <div className="login-bg-circle login-bg-circle--2"></div>
        <div className="login-bg-circle login-bg-circle--3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="login-logo-icon">🔧</span>
            </div>
            <h1 className="login-title">SuaOficina</h1>
            <p className="login-subtitle">Painel Super Admin</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span className="login-error-icon">⚠</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">E-mail</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="admin@suaoficina.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="btn-spinner"></span>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Acesso restrito à equipe SuaOficina</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
