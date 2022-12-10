import { Request, Response, Router } from 'express';
import AuthController from '../controllers/authController';
import AuthUser from '../middleware/authUser';

const authRoutes = Router();
const authenticateUser = new AuthUser();

const authController = new AuthController();

authRoutes.get(
  '/authToken',
  authenticateUser.auth,
  (req: Request, res: Response) => {
    authController.authToken(req, res);
  }
);

export default authRoutes;
