import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const result = await this.repository.findOneOrFail(user_id, {
      relations: ["games"]
    })
    return result
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT id, first_name, last_name, email, created_at, updated_at FROM users ORDER BY first_name ASC"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query("SELECT id, first_name, last_name, email, created_at, updated_at FROM users WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)", [first_name, last_name]); // Complete usando raw query
  }
}
