import { Router } from 'express';
import userRoutes from './userRoutes';
import sendMailRoutes from './sendMailRoutes';
import authRouters from './authRouters';

const router = Router();

router.use('/', authRouters);
router.use('/user', userRoutes);
router.use('/recover-password', sendMailRoutes);

export default router;
