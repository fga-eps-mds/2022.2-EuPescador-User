import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthUser from '../../src/middleware/authUser';
import UserController from '../../src/controllers/userController';
import User from '../../src/database/entities/user';
import Token from '../../src/database/entities/token';
import { connection } from '../../src/database';

const authenticateUser = new AuthUser();

interface Idata {
  id: string;
  admin: boolean;
  superAdmin: boolean;
}

interface RequestWithUserRole extends Request {
  user?: Idata;
}

const userController = new UserController();
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
const mockResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response);
  response.sendStatus = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
};

describe('Test Create User function', () => {
  it('Should get a statusCode 200 when create a user with the right data', async () => {
    const tokenRepository = connection.getRepository(Token);
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'natan@gmail.com',
      password: '123',
      phone: '56565777',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      token: 'mockCode',
    };

    const response = mockResponse();
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn();
    jest
      .spyOn(userRepository, 'save')
      .mockImplementationOnce(() =>
        Promise.resolve({ id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec' })
      );

    tokenRepository.findOne = jest.fn();
    const res = await userController.createUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should get a statusCode 409 if provided used phone', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'user@email.com',
      phone: undefined,
      password: '123',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      token: 'mockCode',
    };

    const response = mockResponse();
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(userMock),
    }));
    const res = await userController.createUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('should get a statusCode 409 if provided email', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      phone: '45645434',
      email: undefined,
      password: '123',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      token: 'mockCode',
    };

    const response = mockResponse();
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(userMock),
    }));
    const res = await userController.createUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('Should get a statusCode 400 if request failed', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      email: 'natan@gmail.com',
      password: '123',
      phone: '56565777',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      token: 'mockCode',
    };

    const response = mockResponse();
    const userRepository = connection.getRepository(User);

    jest
      .spyOn(userRepository, 'save')
      .mockImplementationOnce(() =>
        Promise.reject(Error('Usuário já existente!'))
      );
    const res = await userController.createUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('Test Get All User function', () => {
  it('should return a list of all users', async () => {
    const response = mockResponse();
    const mockRequest = {} as RequestWithUserRole;

    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.user = {
      id: '12',
      admin: true,
      superAdmin: true,
    };

    mockRequest.query = {
      count: '8',
      page: '1',
    };

    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      skip: () => createQueryBuilder,
      take: () => createQueryBuilder,
      orderBy: () => createQueryBuilder,
      getMany: () => [userMock],
    };

    jest
      .spyOn(connection.getRepository(User), 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);

    const userRepository = connection.getRepository(User);

    userRepository.createQueryBuilder().getCount = jest
      .fn()
      .mockResolvedValueOnce(1);

    connection.getRepository(User);

    const res = await userController.getAllUsers(mockRequest, response);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 401 when try get all users with not admin account', async () => {
    const response = mockResponse();
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.user = {
      id: '12',
      admin: false,
      superAdmin: true,
    };

    const res = await userController.getAllUsers(mockRequest, response);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 500 when try get all users', async () => {
    const response = mockResponse();
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };
    mockRequest.query = {
      count: '8',
      page: '1',
    };

    mockRequest.user = {
      id: '12',
      admin: true,
      superAdmin: true,
    };

    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      skip: () => createQueryBuilder,
      take: () => createQueryBuilder,
      getMany: () => [userMock],
    };

    jest
      .spyOn(connection.getRepository(User), 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);

    const userRepository = connection.getRepository(User);

    userRepository.createQueryBuilder().getCount = jest
      .fn()
      .mockImplementation(() => {
        throw new Error();
      });

    const res = await userController.getAllUsers(mockRequest, response);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('Test Get User function', () => {
  it('should get a statusCode 200 if request succeed', async () => {
    const response = mockResponse();
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };
    mockRequest.user = {
      id: '12',
      admin: true,
      superAdmin: true,
    };

    const userRepository = connection.getRepository(User);

    userRepository.findOne = jest.fn().mockResolvedValueOnce([userMock]);

    const res = await userController.getOneUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should get a statusCode 200 if request succeed', async () => {
    const response = mockResponse();
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.params = {
      id: '',
    };

    mockRequest.user = {
      id: '1',
      admin: true,
      superAdmin: true,
    };

    const userRepository = connection.getRepository(User);

    userRepository.findOne = jest.fn().mockResolvedValueOnce([userMock]);

    const res = await userController.getOneUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('Should get a statusCode 404 if send invalid token', async () => {
    const response = mockResponse();
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };
    mockRequest.user = {
      id: '12',
      admin: true,
      superAdmin: true,
    };

    const userRepository = connection.getRepository(User);

    userRepository.findOne = jest.fn().mockResolvedValueOnce(undefined);

    const res = await userController.getOneUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should get a statusCode 500 if user not exist', async () => {
    const response = mockResponse();
    const mockRequest = {} as Request;
    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aedc',
    };

    const userRepository = connection.getRepository(User);

    userRepository.findOne = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.reject(Error('Falha na requisição!'))
      );

    const res = await userController.getOneUser(mockRequest, response);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should get a statusCode 401 if user not autentique', async () => {
    const response = mockResponse();
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };

    mockRequest.user = {
      id: '2',
      admin: false,
      superAdmin: false,
    };

    const userRepository = connection.getRepository(User);

    userRepository.find = jest.fn().mockResolvedValueOnce([userMock]);
    const res = await userController.getOneUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('Test Login function', () => {
  it('should get a statusCode 200 if login with the right data', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      emailPhone: 'natan@gmail.com',
      password: '123',
    };
    const response = mockResponse();
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockResolvedValueOnce([userMock]);
    bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
    jwt.sign = jest.fn().mockResolvedValueOnce('mockToken');
    authenticateUser.generateToken = jest
      .fn()
      .mockResolvedValueOnce('mockToken');
    const res = await userController.login(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('Should get a statusCode 500 if have internal erro', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      emailPhone: 'natan@gmail.com',
      password: '123',
    };

    const response = mockResponse();
    const userRepository = connection.getRepository(User);
    jest
      .spyOn(userRepository, 'findOne')
      .mockImplementationOnce(() =>
        Promise.reject(Error('Falha na requisição!'))
      );

    const res = await userController.login(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('Should get a statusCode 400 if user send invalid data', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      emailPhone: 'natan@gmail.com',
    };

    const response = mockResponse();

    const res = await userController.login(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should get a statusCode 401 if password is incorrect', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      emailPhone: 'batista@sugardaddy.com',
      password: '123',
    };

    const response = mockResponse();
    const userRepository = connection.getRepository(User);

    userRepository.findOne = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(userMock),
    }));
    const res = await userController.login(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should get a statusCode 404 if request failed', async () => {
    const mockRequest = {} as Request;
    mockRequest.body = {
      emailPhone: 'batista@sugardaddy.com',
      password: '12345678',
    };

    const response = mockResponse();
    const userRepository = connection.getRepository(User);

    userRepository.findOne = jest.fn();
    const res = await userController.login(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('Test Update user by id', () => {
  it('Should get a statusCode 500 if have intenal erro', async () => {
    const userRepository = connection.getRepository(User);
    const userMock1 = {
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
    jest.spyOn(userRepository, 'findOne').mockReturnValue(Promise.reject());
    userRepository.update = jest
      .fn()
      .mockReturnValue(Promise.resolve(userMock1));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
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

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUserByID(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should get a statusCode 200 if user update', async () => {
    const userRepository = connection.getRepository(User);
    const userMock1 = {
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
    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(userMock1));
    userRepository.update = jest
      .fn()
      .mockReturnValue(Promise.resolve(userMock1));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
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

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUserByID(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should get a statusCode 401 if user not authorized', async () => {
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.body = {
      name: 'Weslley',
      email: 'weslley17e@gmail.com',
      phone: '11961824141',
      password: 'pass',
      state: 'Distrito Federal',
      city: 'Brasília',
    };

    mockRequest.params = {
      id: '1',
    };

    mockRequest.user = {
      id: '1',
      admin: false,
      superAdmin: false,
    };

    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockResolvedValueOnce(userMock);

    const response = mockResponse();
    const res = await userController.updateUserByID(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should get a statusCode 409 if user changes existing phone', async () => {
    const userRepository = connection.getRepository(User);
    const userMock1 = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      password: '123',
      phone: '56565777',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(userMock1));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.params = {
      id: '1',
    };

    mockRequest.body = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      password: '123',
      phone: '565657737',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUserByID(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('should get a statusCode 404 if user not exister', async () => {
    const userRepository = connection.getRepository(User);

    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(null));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.params = {
      id: '1',
    };

    mockRequest.body = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      password: '123',
      phone: '565657737',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUserByID(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should get a statusCode 409 if user changes existing email', async () => {
    const userRepository = connection.getRepository(User);
    const userMock1 = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      password: '123',
      phone: '56565777',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };
    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(userMock1));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      email: 'natan@gmail.com',
      password: '123',
      phone: '565657737',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    mockRequest.params = {
      id: '1',
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUserByID(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });
});
describe('Test Update user', () => {
  it('Should get a statusCode 409 if user changes existing email', async () => {
    const userRepository = connection.getRepository(User);
    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(null));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      email: 'natan@gmail.com',
      password: '123',
      phone: '565657737',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('Should get a statusCode 500 if have intenal erro', async () => {
    const userRepository = connection.getRepository(User);
    jest.spyOn(userRepository, 'findOne').mockReturnValue(Promise.reject());
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      email: 'natan@gmail.com',
      password: '123',
      phone: '565657737',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('Should get a statusCode 409 if user changes existing cell phone', async () => {
    const userRepository = connection.getRepository(User);
    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(userMock));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      email: 'natan@gmail.com',
      password: '123',
      phone: '565657737',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('should get a statusCode 409 if user changes existing email', async () => {
    const userRepository = connection.getRepository(User);
    const userMock1 = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      password: '123',
      phone: '56565777',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };
    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(userMock1));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      email: 'natan@gmail.com',
      password: '123',
      phone: '565657737',
      name: 'Jerson',
      state: 'Goias',
      city: 'Rio Verde',
      admin: true,
      superAdmin: true,
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('should get a statusCode 200 if user update', async () => {
    const userRepository = connection.getRepository(User);
    const userMock1 = {
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
    jest
      .spyOn(userRepository, 'findOne')
      .mockReturnValue(Promise.resolve(userMock1));
    userRepository.update = jest
      .fn()
      .mockReturnValue(Promise.resolve(userMock1));
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    mockRequest.body = {
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

    mockRequest.user = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
      admin: true,
      superAdmin: true,
    };

    const response = mockResponse();
    const res = await userController.updateUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('Test Delete user', () => {
  it('should get a statusCode 401 if user not authorized', async () => {
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.body = {
      name: 'Weslley',
      email: 'weslley17e@gmail.com',
      phone: '11961824141',
      password: 'pass',
      state: 'Distrito Federal',
      city: 'Brasília',
    };

    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d',
      admin: false,
      superAdmin: false,
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };

    const response = mockResponse();
    const res = await userController.deleteUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should get a statusCode 200 if delete user', async () => {
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.body = {
      name: 'Weslley',
      email: 'weslley17e@gmail.com',
      phone: '11961824141',
      password: 'pass',
      state: 'Distrito Federal',
      city: 'Brasília',
    };

    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d',
      admin: true,
      superAdmin: true,
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockResolvedValueOnce(userMock);
    userRepository.remove = jest.fn();
    const response = mockResponse();
    const res = await userController.deleteUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('Should get a statusCode 500 if have intenal erro', async () => {
    const mockRequest = {} as RequestWithUserRole;
    mockRequest.body = {
      name: 'Weslley',
      email: 'weslley17e@gmail.com',
      phone: '11961824141',
      password: 'pass',
      state: 'Distrito Federal',
      city: 'Brasília',
    };

    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d',
      admin: true,
      superAdmin: true,
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockResolvedValueOnce(Promise.reject());
    userRepository.remove = jest.fn();
    const response = mockResponse();
    const res = await userController.deleteUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should get a status Code 404 if user not exist', async () => {
    const mockRequest = {} as RequestWithUserRole;

    mockRequest.headers = {
      authorization: 'Bearer mockToken',
    };

    mockRequest.user = {
      id: '53dd2dfe-a4d',
      admin: true,
      superAdmin: true,
    };

    mockRequest.params = {
      id: '53dd2dfe-a4d6-4af7-99a9-afc06db20aec',
    };
    const userRepository = connection.getRepository(User);
    userRepository.findOne = jest.fn().mockResolvedValueOnce(null);
    userRepository.remove = jest.fn();
    const response = mockResponse();
    const res = await userController.deleteUser(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('Test auth', () => {
  it('should get a statusCode 401 if user not authorized', async () => {
    const mockRequest = {} as RequestWithUserRole;
    const response = mockResponse();
    const res = await userController.authToken(mockRequest, response);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
