import { Request, Response } from 'express';
import { sendMail } from '../services/sendMailService'

export default class SendMailController {
  sendMail = async (req: Request, res: Response) => {
    try {
      await sendMail();
    } catch (error) {
      console.log(error);
    }
  }
}