import { Router } from 'express';
import userRoutes from './userRoutes';
import loginRoutes from './loginRoutes';
import sendMailRoutes from './sendMailRoutes';
import authRouters from './authRoutes';

const router = Router();

router.use('/', authRouters);
router.use('/user', userRoutes);
router.use('/login', loginRoutes);
router.use('/recover-password', sendMailRoutes);

export default router;
