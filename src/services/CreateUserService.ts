import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    // Pega o Repository direto do TypeORM pq usa os methods padrão
    const usersRepository = getRepository(User);

    // Verifica se o email já existe. O email deve ser unico no database
    const checkUsersExist = await usersRepository.findOne({
      where: { email },
    });

    if (checkUsersExist) {
      throw new Error('Email address already used.');
    }

    const user = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;