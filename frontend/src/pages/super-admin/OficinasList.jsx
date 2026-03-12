import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const OficinasList = () => {
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { profile } = useAuth();

  useEffect(() => {
    // Apenas Super Admin deve ver isso
    if (profile?.role !== 'super_admin') {
      navigate('/super-admin/dashboard');
      return;
    }

    fetchOficinas();
  }, [profile, navigate]);

  const fetchOficinas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('oficinas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOficinas(data || []);
    } catch (err) {
      console.error('Erro ao buscar oficinas:', err.message);
      setError('Não foi possível carregar a lista de oficinas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/super-admin/oficinas/nova');
  };

  return (
    <div className="list-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Oficinas Cadastradas</h2>
          <p className="page-description">Gerencie as oficinas que utilizam a plataforma.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateNew}>
          <span className="icon">➕</span> Nova Oficina
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="loading-state">Carregando oficinas...</div>
        ) : oficinas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏪</div>
            <h3>Nenhuma oficina cadastrada</h3>
            <p>Clique no botão acima para adicionar a primeira oficina.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Responsável</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {oficinas.map((oficina) => (
                  <tr key={oficina.id}>
                    <td>
                      <div className="font-medium">{oficina.nome}</div>
                      <div className="text-sm text-gray">{oficina.email}</div>
                    </td>
                    <td>{oficina.cnpj || '-'}</td>
                    <td>{oficina.responsavel || '-'}</td>
                    <td>{oficina.telefone || '-'}</td>
                    <td>
                      <span className={`badge badge-${oficina.status === 'ativa' ? 'success' : 'neutral'}`}>
                        {oficina.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-ghost" title="Editar">
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OficinasList;
