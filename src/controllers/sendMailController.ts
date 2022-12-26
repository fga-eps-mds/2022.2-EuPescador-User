/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { FindOptionsWhere, LessThan } from 'typeorm';
import { readFileSync } from 'fs';
import { v4 as uuidV4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { hash } from 'bcrypt';
import SendMailService from '../services/sendMailService';
import { connection } from '../database';
import User from '../database/entities/user';
import Token from '../database/entities/token';
import { generateToken } from '../utils/generateToken';

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
        return res.status(500).json({ message: 'email não enviado!' });
      }

      const userRepository = connection.getRepository(User);
      const tokenRepository = connection.getRepository(Token);
      await tokenRepository.delete({ expires_at: LessThan(dayjs().toDate()) });
      const tokenValue = generateToken();
      const html = data.replace('{{ token }}', tokenValue);

      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'email não encontrado!' });
      }

      const haveValidToken = await tokenRepository.findOne({
        where: { user_id: user.id },
      });

      if (haveValidToken) {
        return res.status(409).json({
          mensage: 'Token já enviado!',
          time: dayjs(haveValidToken.expires_at).diff(dayjs(), 'minute'),
        });
      }
      const sendMail = new SendMailService();
      await sendMail.send(email, html, 'Recuperação de Senha');
      const token = new Token();
      token.id = uuidV4();
      token.value = tokenValue;
      token.user_id = user.id;
      token.expires_at = dayjs().add(30, 'minutes').toDate();

      await tokenRepository.save(token);

      return res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Falha ao enviar email!' });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const { value } = req.params as FindOptionsWhere<Token>;

      const tokenRepository = connection.getRepository(Token);

      const isTokenExists = await tokenRepository.findOne({
        where: { value },
      });

      if (isTokenExists) {
        return res
          .status(200)
          .json({ message: 'Token encontrado!', token: isTokenExists });
      }

      return res.status(404).json({
        message: 'Token não encontado!',
      });
    } catch (error) {
      return res.status(500).json({
        message:
          'Falha ao buscar token, tente gerar um token novamente e validá-lo!',
      });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const { password, token } = await req.body;
      const hashedPassword = await hash(password, 10);

      const tokenRepository = connection.getRepository(Token);
      const userRepository = connection.getRepository(User);
      await tokenRepository.delete({ expires_at: LessThan(dayjs().toDate()) });
      const isTokenExists = await tokenRepository.findOne({
        where: { value: token },
      });

      if (!isTokenExists) {
        return res.status(401).json({
          mensage: 'token inválido!',
        });
      }

      userRepository.update(String(isTokenExists.user_id), {
        password: hashedPassword,
      });

      await tokenRepository.delete({ value: token });
      return res.status(200).json({
        message: 'Senha atualizada com sucesso!',
      });
    } catch (error) {
      return res.status(404).json({
        mensage: 'Erro ao atualizar senha!',
      });
    }
  }
}
