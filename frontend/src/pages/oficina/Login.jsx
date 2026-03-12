import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OficinaLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();

  // Se já está logado como oficina, redireciona
  if (isAuthenticated && (profile?.role === 'oficina_admin' || profile?.role === 'oficina_user')) {
    return <Navigate to="/oficina/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Tentando logar com:', email);
      const result = await login(email, password);
      console.log('Resultado do login:', result);

      if (!['oficina_admin', 'oficina_user'].includes(result.profile.role)) {
        console.log('Role inválida:', result.profile.role);
        setError('Acesso negado. Esta área é exclusiva para usuários de oficinas.');
        setIsLoading(false);
        return;
      }

      console.log('Redirecionando para dashboard da oficina usando navigate...');
      navigate('/oficina/dashboard');
    } catch (err) {
      console.error('Erro no catch do login:', err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page login-page--oficina">
      <div className="login-bg-effects">
        <div className="login-bg-circle login-bg-circle--1"></div>
        <div className="login-bg-circle login-bg-circle--2"></div>
        <div className="login-bg-circle login-bg-circle--3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="login-logo-icon">🏪</span>
            </div>
            <h1 className="login-title">SuaOficina</h1>
            <p className="login-subtitle">Painel da Oficina</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span className="login-error-icon">⚠</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="oficina-email" className="form-label">E-mail</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="oficina-email"
                  type="email"
                  className="form-input"
                  placeholder="contato@suaoficina.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="oficina-password" className="form-label">Senha</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="oficina-password"
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
            <p>Acesso exclusivo para oficinas cadastradas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OficinaLogin;
