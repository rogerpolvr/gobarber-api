import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

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
      throw new Error(errorMessage);
    }

    // user.password - Senha criptografada
    // password - Senha não-criptografada

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error(errorMessage);
    }

    // Payload - Informações do user: Id, username, permissões...
    // Hash - Gerada no site MD5 de forma randomica
    // Opções de SignOn - Usuário, tempo de expiração
    const token = sign({}, '229d282e0d12bb43de18d0eafa25a667', {
      subject: user.id,
      expiresIn: '10h',
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
