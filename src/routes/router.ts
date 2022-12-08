import { Router } from 'express';
import userRoutes from './userRoutes';
import sendMailRoutes from './sendMailRoutes';

const router = Router();

router.use('/user', userRoutes);
router.use('/recover-password', sendMailRoutes);

export default router;
