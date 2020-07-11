import { getRepository } from 'typeorm';
// import { hash } from 'bcryptjs';
import User from '../models/User';
import usersRouter from '../routes/users.routes';
import { compare } from 'bcryptjs';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
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

    return {
      user,
    };
  }
}

export default AuthenticateUserService;
