import { Router } from 'express';
import { login, me, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Rotas públicas
router.post('/login', login);

// Rotas protegidas
router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

export default router;
