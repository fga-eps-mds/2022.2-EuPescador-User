import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import AuthUser from '../../src/middleware/authUser';
import { connection } from '../../src/database';
import User from '../../src/database/entities/user';

const mockResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response);
  response.sendStatus = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
};

interface Idata {
  id: string;
  admin: boolean;
  superAdmin: boolean;
}

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

const auth = new AuthUser();

describe('Test middleware generateToken', () => {
  it('Should get a statusCode 401 when user send header', async () => {
    process.env.AUTH_CONFIG_SECRET = 'test';
    const data = {
      id: 'id',
      admin: false,
      superAdmin: false,
    } as Idata;
    const token = auth.generateToken(data);
    expect(token).not.toBeNull();
  });
});

describe('Test middleware authUser', () => {
  it('Should get a statusCode 401 when user send header', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    const res = (await auth.auth(mockRequest, response, () => {})) as Response;
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Should get a statusCode 401 when user send invalid token', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.headers = {
      authorization: 'Bearer fake',
    };
    const res = (await auth.auth(mockRequest, response, () => {})) as Response;
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Should get a statusCode 401 when user not authorization', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.headers = {
      authorization: 'Bearer fake',
    };
    jwt.verify = jest.fn().mockImplementation(() => {});
    const saida = {
      id: 'true',
      admin: true,
      superAdmin: true,
    };
    jwt.decode = jest.fn().mockImplementation(() => saida);
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockImplementationOnce(() => null);
    const res = (await auth.auth(mockRequest, response, () => {})) as Response;

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Should get a statusCode 401 when user not authorization', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.headers = {
      authorization: 'Bearer fake',
    };
    jwt.verify = jest.fn().mockImplementation(() => {});
    const saida = {
      id: 'true',
      admin: true,
      superAdmin: true,
    };
    jwt.decode = jest.fn().mockImplementation(() => saida);
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(userMock),
    }));
    const res = (await auth.auth(mockRequest, response, () => {})) as Response;
    expect(res).toBeNull();
  });
});
