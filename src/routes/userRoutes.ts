import { Request, Response, Router } from 'express';
import UserController from '../controllers/userController';

const userRoutes = Router();

const userController = new UserController();

userRoutes.post('/', (req: Request, res: Response) => {
  userController.createUser(req, res);
});

userRoutes.get('/', (req: Request, res: Response) => {
  userController.getAllUsers(res);
});

userRoutes.get('/user/:id', (req: Request, res: Response) => {
  userController.getOneUser(req, res);
});

userRoutes.post('/login', (req: Request, res: Response) => {
  userController.login(req, res);
});

userRoutes.put('/', (req: Request, res: Response) => {
  userController.updateUser(req, res);
});

export default userRoutes;
