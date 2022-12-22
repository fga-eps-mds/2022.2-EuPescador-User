import { Request, Response, Router } from 'express';
import SendMailController from '../controllers/sendMailController';

const sendMailRoutes = Router();

const sendMailController = new SendMailController();

sendMailRoutes.post('/', (req: Request, res: Response) => {
  sendMailController.sendMail(req, res);
});

sendMailRoutes.get('/token/:value', (req: Request, res: Response) => {
  sendMailController.verifyToken(req, res);
});

sendMailRoutes.post('/update', (req: Request, res: Response) => {
  sendMailController.updatePassword(req, res);
});

export default sendMailRoutes;
