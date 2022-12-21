import { Request, Response } from 'express';
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

const tokenMock = {
  id: '123',
  value: '1234',
  user_id: '12345',
  expires_at: '2021-08-10T20:00:00.000Z',
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

  it('Should get a statusCode 409 if use have valid token', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'teste@teste.com',
    };

    userRepository.findOne = jest.fn().mockImplementationOnce(() => userMock);
    tokenRepository.delete = jest.fn().mockImplementationOnce(() => undefined);
    tokenRepository.findOne = jest.fn().mockImplementationOnce(() => tokenMock);
    const res = await sendMail.sendMail(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });
});

describe('Test verify token function', () => {
  it('Should get a statusCode 500 when user not send header', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    const res = await sendMail.verifyToken(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('Should get a statusCode 200 when user send valid token', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.params = {
      value: 'mockToken',
    };
    tokenRepository.findOne = jest.fn().mockImplementationOnce(() => tokenMock);
    const res = await sendMail.verifyToken(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('Should get a statusCode 404 when user send invalid token', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.params = {
      value: 'mockToken',
    };
    tokenRepository.findOne = jest.fn().mockImplementationOnce(() => undefined);
    const res = await sendMail.verifyToken(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('Test update password function', () => {
  it('Should get a statusCode 500 when user not send header', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    const res = await sendMail.updatePassword(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Should get a statusCode 401 when user send invalid token', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      token: 'mockToken',
      password: 'password',
    };
    tokenRepository.findOne = jest.fn().mockImplementationOnce(() => undefined);
    const res = await sendMail.updatePassword(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Should get a statusCode 200 when update password', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.body = {
      token: 'mockToken',
      password: 'password',
    };
    tokenRepository.findOne = jest.fn().mockImplementationOnce(() => tokenMock);
    userRepository.update = jest.fn().mockImplementationOnce(() => userMock);
    const res = await sendMail.updatePassword(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
