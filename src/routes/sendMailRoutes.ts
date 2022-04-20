import { Request, Response, Router } from 'express';
import SendMailController from '../controllers/sendMailController';

const sendMailRoutes = Router();

const sendMailController = new SendMailController();

sendMailRoutes.get('/', () => {
  sendMailController.sendMail();
});

export default sendMailRoutes;
