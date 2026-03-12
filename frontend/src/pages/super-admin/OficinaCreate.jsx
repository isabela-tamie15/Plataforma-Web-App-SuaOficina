import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const OficinaCreate = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    responsavel: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Máscaras e Formatação Dinâmica
  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/, '$1.$2') // Coloca ponto entre o segundo e o terceiro dígitos
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca ponto entre o quinto e o sexto dígitos
      .replace(/\.(\d{3})(\d)/, '.$1/$2') // Coloca uma barra entre o oitavo e o nono dígitos
      .replace(/(\d{4})(\d)/, '$1-$2') // Coloca um hífen depois do bloco de quatro dígitos
      .slice(0, 18); // Limita tamanho
  };

  const formatTelefone = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length <= 10) {
      return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cnpj') formattedValue = formatCNPJ(value);
    if (name === 'telefone') formattedValue = formatTelefone(value);
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) return 'A Razão Social é obrigatória.';
    
    // Validar CNPJ completo
    const cnpjNumeros = formData.cnpj.replace(/\D/g, '');
    if (cnpjNumeros.length !== 14) return 'O CNPJ deve ter 14 dígitos válidos.';

    // Validar Email
    const emailRef = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRef.test(formData.email)) return 'Informe um endereço de e-mail válido.';

    return null; // OK
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Apenas Super Admin deve poder criar
    if (profile?.role !== 'super_admin') {
      setError('Permissão negada. Apenas Super Administradores podem cadastrar oficias.');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Inserir na tabela via Supabase
      const { data, error: insertError } = await supabase
        .from('oficinas')
        .insert([
          {
            nome: formData.nome,
            cnpj: formData.cnpj,
            endereco: formData.endereco,
            telefone: formData.telefone,
            email: formData.email,
            responsavel: formData.responsavel,
            status: 'ativa' // status padrão
          }
        ])
        .select();

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess(true);
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/super-admin/oficinas');
      }, 2000);

    } catch (err) {
      console.error('Erro no cadastro de oficina:', err.message);
      setError('Falha ao cadastrar a oficina. Verifique se o CNPJ já não existe e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Cadastrar Nova Oficina</h2>
          <p className="page-description">
            Informe os dados comerciais da nova oficina cliente para habilitar seu acesso.
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/super-admin/oficinas')}>
          Voltar para Lista
        </button>
      </div>

      <div className="card">
        {success ? (
           <div className="alert alert-success">
             Oficina cadastrada com sucesso! Redirecionando...
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            {error && <div className="alert alert-error form-full-width">{error}</div>}

            <div className="form-group form-full-width">
              <label htmlFor="nome">Razão Social / Nome da Oficina *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="form-input"
                placeholder="Ex: Auto Mecânica J&B Ltda"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                className="form-input"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="responsavel">Nome do Responsável</label>
              <input
                type="text"
                id="responsavel"
                name="responsavel"
                className="form-input"
                placeholder="Ex: João Batista"
                value={formData.responsavel}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone / WhatsApp</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                className="form-input"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Comercial *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="contato@autojb.com.br"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group form-full-width">
              <label htmlFor="endereco">Endereço Completo</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                className="form-input"
                placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo/SP"
                value={formData.endereco}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions form-full-width" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginRight: '1rem' }}
                onClick={() => navigate('/super-admin/oficinas')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Cadastrar Oficina'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OficinaCreate;
