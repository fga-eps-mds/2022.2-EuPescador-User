import { Request, Response } from 'express';

import nodemailer from 'nodemailer';
import { connection } from '../../src/database';
import User from '../../src/database/entities/user';
import Token from '../../src/database/entities/token';
import SendMailController from '../../src/controllers/sendMailController';
import SendMailService from '../../src/services/sendMailService';

const userRepository = connection.getRepository(User);
const tokenRepository = connection.getRepository(Token);
const sendMail = new SendMailController();
const sendMailService = new SendMailService();

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

  it('Should get a statusCode 200 if send mail', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'teste@teste.com',
    };

    mockRequest.params = {
      value: '1',
    };

    userRepository.findOne = jest.fn().mockImplementationOnce(() => userMock);
    userRepository.save = jest.fn().mockImplementationOnce(() => userMock);
    nodemailer.createTransport = jest.fn().mockImplementationOnce(() => ({
      sendMail: () => Promise.resolve({}),
      close: () => Promise.resolve({}),
    }));
    sendMailService.send = jest.fn().mockImplementationOnce(() => true);

    const res = await sendMail.sendMail(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
