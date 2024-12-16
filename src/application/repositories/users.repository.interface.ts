import type { User, CreateUser } from '@/src/entities/models/user';
import type { ITransaction } from '@/src/entities/models/transaction.interface';

export interface IUsersRepository {
  getUser(id: User['id']): Promise<User | undefined>;
  getUserByEmail(email: User['email']): Promise<User | undefined>;
  createUser(input: CreateUser, tx?: ITransaction): Promise<User>;
  setUserEmailAsVerified(userId: User['id']): Promise<void>;
}
