import { Request, Response } from 'express';

import nodemailer from 'nodemailer';
import { connection } from '../../src/database';
import User from '../../src/database/entities/user';
import Token from '../../src/database/entities/token';
import SendMailController from '../../src/controllers/sendMailController';

const userRepository = connection.getRepository(User);
const tokenRepository = connection.getRepository(Token);
const sendMail = new SendMailController();

const mockResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response);
  response.sendStatus = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
};

const userMock = {
  id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
  email: 'natan@gmail.com',
  password: '123',
  phone: '56565777',
  name: 'Jerson',
  state: 'Goias',
  city: 'Rio Verde',
  admin: true,
  superAdmin: true,
};

const tokenMock = {
  id: '53dd2dfe-a4d6-4af7-99a9-afc062b20aec',
  user_id: '531d2dfe-aw4d6-4af7-99a9-afc062b20aec',
  expires_at: new Date(),
};

describe('Test send mail function', () => {
  it('Should get a statusCode 500 when user not send header', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    const res = await sendMail.sendMail(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('Should get a statusCode 500 when user send null email', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: undefined,
    };
    const res = await sendMail.sendMail(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('Should get a statusCode 404 if email not found', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'teste@teste.com',
    };

    userRepository.findOne = jest.fn().mockImplementationOnce(() => null);
    tokenRepository.delete = jest.fn().mockImplementationOnce(() => undefined);
    const res = await sendMail.sendMail(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Should get a statusCode 408', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'mock@email.com',
    };
    tokenRepository.delete = jest.fn().mockImplementationOnce(() => undefined);
    userRepository.findOne = jest.fn().mockImplementationOnce(() => userMock);
    tokenRepository.findOne = jest.fn().mockImplementationOnce(() => tokenMock);

    const res = await sendMail.sendMail(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(408);
  });

  it('Should get a statusCode 200', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'mock@email.com',
    };
    tokenRepository.delete = jest.fn().mockImplementationOnce(() => undefined);
    userRepository.findOne = jest.fn().mockImplementationOnce(() => userMock);
    tokenRepository.findOne = jest.fn().mockImplementationOnce(() => null);
    userRepository.save = jest.fn().mockImplementationOnce(() => userMock);
    nodemailer.createTransport = jest.fn().mockImplementationOnce(() => ({
      sendMail: () => Promise.resolve({}),
      close: () => Promise.resolve({}),
    }));
    tokenRepository.save = jest.fn().mockImplementationOnce(() => tokenMock);

    const res = await sendMail.sendMail(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
