/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';

export default class AuthController {
  authToken = async (req: Request, res: Response) =>
    res.status(200).json({
      message: 'Token valido!',
    });
}
