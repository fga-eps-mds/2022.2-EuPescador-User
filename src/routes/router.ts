import { Router } from 'express';
import adminRoutes from './adminRoutes';
// Rotas
import userRoutes from './userRoutes';

const router = Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
