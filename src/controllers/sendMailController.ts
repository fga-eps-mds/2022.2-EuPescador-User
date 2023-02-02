/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { LessThan } from 'typeorm';
import { readFileSync } from 'fs';
import { v4 as uuidV4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { hash } from 'bcrypt';
import SendMailService from '../services/sendMailService';
import { connection } from '../database';
import User from '../database/entities/user';
import { generateToken } from '../utils/generateToken';
import Token from '../database/entities/token';

dayjs.extend(utc);

const data = readFileSync('./src/html/recoverypassword.html', {
  encoding: 'utf8',
  flag: 'r',
});

export default class SendMailController {
  async sendMail(req: Request, res: Response) {
    try {
      const { email } = await req.body;

      if (!email) {
        return res.status(500).json({ message: 'Email não enviado!' });
      }

      const userRepository = connection.getRepository(User);
      const tokenRepository = connection.getRepository(Token);
      await tokenRepository.delete({ expires_at: LessThan(dayjs().toDate()) });
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }

      const haveValidToken = await tokenRepository.findOne({
        where: { user_id: user.id },
      });

      if (haveValidToken) {
        return res.status(408).json({
          mensage:
            'A senha dessa conta já foi alterada recentemente. Verifique o email da conta!',
        });
      }

      const senha = generateToken();
      const hashedPassword = await hash(senha, 10);
      let html = data.replace('{{ USUARIO }}', String(user?.name));
      html = html.replace('{{ SENHA }}', senha);
      user.password = hashedPassword;
      await userRepository.save(user);

      const sendMail = new SendMailService();
      await sendMail.send(email, html, 'Recuperação de Senha');

      const token = new Token();
      token.id = uuidV4();
      token.user_id = user?.id;
      token.expires_at = dayjs().add(30, 'minutes').toDate();

      await tokenRepository.save(token);

      return res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Falha ao enviar email!' });
    }
  }
}
