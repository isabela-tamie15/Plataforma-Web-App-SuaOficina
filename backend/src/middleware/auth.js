import { supabaseAdmin } from '../config/supabase.js';

/**
 * Middleware de autenticação
 * Verifica o token JWT do Supabase e carrega o perfil do usuário
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token com Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
      });
    }

    // Buscar perfil na tabela profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({
        error: 'Perfil do usuário não encontrado',
      });
    }

    // Injetar dados do usuário no request
    req.user = {
      id: user.id,
      email: user.email,
      ...profile,
    };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno de autenticação',
    });
  }
};

export default authMiddleware;
