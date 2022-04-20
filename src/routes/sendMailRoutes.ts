import { Request, Response, Router } from 'express';
import SendMailController from '../controllers/sendMailController';

const sendMailRoutes = Router();

const sendMailController = new SendMailController();

sendMailRoutes.get('/', (req: Request, res: Response) => {
  sendMailController.sendMail(req, res);
});

export default sendMailRoutes;
