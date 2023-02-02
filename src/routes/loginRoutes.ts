import { Request, Response, Router } from 'express';
import UserController from '../controllers/userController';

const loginRoutes = Router();
const userController = new UserController();

loginRoutes.post('/', (req: Request, res: Response) => {
  userController.login(req, res);
});

export default loginRoutes;
