import { supabaseAdmin } from '../config/supabase.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * POST /api/auth/login
 * Login com email e senha via Supabase Auth
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
      });
    }

    // Criar client temporário para login (usa anon key para contexto de usuário)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Autenticar via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        details: authError.message,
      });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        error: 'Perfil do usuário não encontrado. Contate o administrador.',
      });
    }

    return res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nome: profile.nome,
        role: profile.role,
        oficina_id: profile.oficina_id,
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      error: 'Erro interno no servidor',
    });
  }
};

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 */
export const me = async (req, res) => {
  try {
    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        nome: req.user.nome,
        role: req.user.role,
        oficina_id: req.user.oficina_id,
        avatar_url: req.user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      error: 'Erro interno no servidor',
    });
  }
};

/**
 * POST /api/auth/logout
 * Invalidar sessão (o frontend também limpa o token local)
 */
export const logout = async (req, res) => {
  try {
    return res.json({
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    return res.status(500).json({
      error: 'Erro interno no servidor',
    });
  }
};
