import { hashSync } from 'bcrypt-ts';

import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { CreateUser, User } from '@/src/entities/models/user';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class MockUsersRepository implements IUsersRepository {
  private _users: User[];

  constructor() {
    this._users = [
      {
        id: '1',
        email: 'one@mail.com',
        password: hashSync('password-one', PASSWORD_SALT_ROUNDS),
        name: "one",
        role: "user",
        createdAt: new Date()
      },
      {
        id: '2',
        email: 'two@mail.com',
        password: hashSync('password-two', PASSWORD_SALT_ROUNDS),
        name: "two",
        role: "user",
        createdAt: new Date()
      },
      {
        id: '3',
        email: 'three@mail.com',
        password: hashSync('password-three', PASSWORD_SALT_ROUNDS),
        name: "three",
        role: "user",
        createdAt: new Date()
      },
     
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.id === id);
    return user;
  }
  async getUserByEmail(username: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.email === username);
    return user;
  }
  async createUser(input: CreateUser): Promise<User> {
    const newUser: User = {
      id: this._users.length.toString(),
      email: input.email,
      password: input.password,
      role: "user",
      createdAt: new Date(),
      name: "now"
    };
    this._users.push(newUser);
    return newUser;
  }
}