import { Request, Response } from 'express';
import { sendMailService } from '../services/sendMailService';
import { connection } from '../config/database';
import { User } from '../models/user';
import { Token } from '../models/token';

export default class SendMailController {
  async sendMail(req: Request, res: Response) {
    try {
      const { email } = await req.body;

      const tokenValue = await sendMailService(email);

      const userRepository = connection.getRepository(User);
      const tokenRepository = connection.getRepository(Token);

      const user = await userRepository.findOne({where: { email }});

      const token = new Token();
      token.value = tokenValue;
      token.user_id = String(user!.id); 

      await tokenRepository.save(token);
    } catch (error) {
      console.log(error);
    }
  }
}