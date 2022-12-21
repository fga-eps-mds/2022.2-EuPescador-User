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

  async auth(
    request: RequestWithUserRole,
    response: Response,
    next: NextFunction
  ): Promise<Response | null> {
    let decodeToken;
    let token;
    let userExist;

    try {
      token = request.headers.authorization?.split(' ')[1];
      verify(token as string, process.env.AUTH_CONFIG_SECRET as string);
      decodeToken = decode(token as string);
      const { id, admin, superAdmin } = decodeToken as Idata;
      const userRepository = connection.getRepository(User);
      userExist = await userRepository.findOne({
        where: { id, admin, superAdmin },
        select: ['id', 'admin', 'superAdmin'],
      });
    } catch (err) {
      return response.status(401).json({
        message: 'Token inválido!',
      });
    }

    if (!userExist) {
      return response.status(401).json({
        message: 'Token inválido!',
      });
    }

    request.user = userExist as Idata;
    next();
    return null;
  }
}
