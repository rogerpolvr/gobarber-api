import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const errorMessage = 'Incorrect email/password combination.';

    const userReposistory = getRepository(User);

    const user = await userReposistory.findOne({ where: { email } });

    if (!user) {
      throw new AppError(errorMessage, 401);
    }

    // user.password - Senha criptografada
    // password - Senha não-criptografada

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError(errorMessage, 401);
    }

    // Payload - Informações do user: Id, username, permissões...
    // Hash - Gerada no site MD5 de forma randomica
    // Opções de SignOn - Usuário, tempo de expiração

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
