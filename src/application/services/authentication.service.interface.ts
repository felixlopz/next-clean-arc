import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';

export interface IAuthenticationService {
  generateUserId(): string;
  validateSession(
    sessionId: Session['id'] | null
  ): Promise<{ user: Omit<User, 'password'>; session: Session }>;
  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean>;
  createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
  invalidateSession(
    sessionId: Session['id'] | null
  ): Promise<{ blankCookie: Cookie }>;
}
