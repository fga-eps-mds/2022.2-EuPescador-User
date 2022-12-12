import { sign, verify, decode } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { connection } from '../database';
import User from '../database/entities/user';

interface Idata {
  id: string;
  admin: boolean;
  superAdmin: boolean;
}

interface RequestWithUserRole extends Request {
  user?: Idata;
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

  async auth(
    request: RequestWithUserRole,
    response: Response,
    next: NextFunction
  ) {
    const headerBearer = request.headers.authorization;

    if (!headerBearer) {
      response.status(401).json({ message: 'Token obrigatorio' });
    }

    const token = headerBearer?.split(' ')[1];
    let decodeToken;

    try {
      verify(token as string, process.env.AUTH_CONFIG_SECRET as string);
      decodeToken = decode(token as string);
    } catch {
      response.status(401).json({ message: 'Token invalido!' });
    }

    const { id, admin, superAdmin } = decodeToken as Idata;
    const userRepository = connection.getRepository(User);

    const user = await userRepository.findOne({
      where: { id, admin, superAdmin },
    });

    if (!user) {
      response.status(401).json({ message: 'Token invalido!' });
    }

    request.user = decodeToken as Idata;

    next();
  }
}
