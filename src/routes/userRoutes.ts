import { Request, Response, Router } from 'express';
import UserController from '../controllers/userController';
import AuthUser from '../middleware/authUser';

const authenticateUser = new AuthUser();

const userRoutes = Router();

const userController = new UserController();

userRoutes.post('/', (req: Request, res: Response) => {
  userController.createUser(req, res);
});

userRoutes.get('/', authenticateUser.auth, (req: Request, res: Response) => {
  userController.getAllUsers(req, res);
});

userRoutes.get('/:id', authenticateUser.auth, (req: Request, res: Response) => {
  userController.getOneUser(req, res);
});

userRoutes.post('/login', (req: Request, res: Response) => {
  userController.login(req, res);
});

userRoutes.put('/', authenticateUser.auth, (req: Request, res: Response) => {
  userController.updateUser(req, res);
});

userRoutes.put('/:id', authenticateUser.auth, (req: Request, res: Response) => {
  userController.updateUserByID(req, res);
});

userRoutes.delete(
  '/:id',
  authenticateUser.auth,
  (req: Request, res: Response) => {
    userController.deleteUser(req, res);
  }
);

userRoutes.get(
  '/authToken/:token',
  authenticateUser.auth,
  (req: Request, res: Response) => {
    userController.authToken(req, res);
  }
);

export default userRoutes;
