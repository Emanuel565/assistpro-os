import { Router } from 'express';
import { getEmpresaConfig, updateEmpresaConfig } from '../controllers/empresa.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Rota pública para obtenção dos dados da empresa (usado no login, topo e recibos)
router.get('/public', getEmpresaConfig);

// Rotas autenticadas
router.get('/', authMiddleware, getEmpresaConfig);
router.patch('/', authMiddleware, requireRole('ADMIN'), updateEmpresaConfig);

export default router;
