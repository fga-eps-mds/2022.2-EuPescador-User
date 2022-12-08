import { sign, verify, decode } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { connection } from '../database';
import User from '../database/entities/user';

interface Idata {
  id: string;
  admin: boolean;
  superAdmin: boolean;
}
export default class AuthUser {
  generateToken(data: Idata) {
    return sign(data, process.env.AUTH_CONFIG_SECRET as string, {
      subject: data.id,
      expiresIn: '30d',
    });
  }

  decodeToken(token: string): Idata {
    const decodeToken = decode(token) as Idata;
    if (!decodeToken) {
      throw new Error('Token invalido!');
    }

    return decodeToken;
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    const headerBearer = request.headers.authorization;

    if (!headerBearer) {
      response.status(401).json({ message: 'Token obrigatorio' });
      throw new Error('Token invalido!');
    }

    const token = String(headerBearer?.split(' ')[1]);
    try {
      verify(token, process.env.AUTH_CONFIG_SECRET as string);
      const { id, admin, superAdmin } = decode(token) as Idata;
      const userRepository = connection.getRepository(User);
      const user = await userRepository.findOne({
        where: { id, admin, superAdmin },
      });

      if (!user) {
        response.status(401).json({ message: 'Token invalido' });
      }

      next();
    } catch {
      response.status(401).json({ message: 'Token invalido' });
      throw new Error('Token invalido');
    }
  }
}
