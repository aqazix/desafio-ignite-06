import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
    .createQueryBuilder("games")
    .where("LOWER(games.title) LIKE LOWER(:param)", {
      param: `%${param}%`
    })
    .getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT Count(*) as count FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const queryResult = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "users")
      .where("games.id = :id", { id })
      .getMany();
      // Complete usando query builder

      let users: User[] = [];

      queryResult.map(game => users = users.concat(game.users));

    return users;
  }
}
