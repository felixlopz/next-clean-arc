import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt-ts';

import { db } from '@/drizzle';
import { users } from '@/drizzle/schema';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import type { CreateUser, User } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}
  async getUser(id: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUser' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.id, id),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'pg' },
            },
            () => query.execute()
          );

          if (user == null) {
            return undefined;
          }

          return { ...user, emailVerified: Boolean(user?.emailVerified) };
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByEmail' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.email, email),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'pg' },
            },
            () => query.execute()
          );

          if (user == null) {
            return undefined;
          }

          return { ...user, emailVerified: Boolean(user?.emailVerified) };
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async createUser(input: CreateUser): Promise<User> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > createUser' },
      async () => {
        try {
          const password_hash = await this.instrumentationService.startSpan(
            { name: 'hash password', op: 'function' },
            () => hash(input.password, PASSWORD_SALT_ROUNDS)
          );

          const newUser: CreateUser = {
            id: input.id,
            name: input.name,
            email: input.email,
            password: password_hash,
          };
          const query = db.insert(users).values(newUser).returning();

          const [createdUser] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'pg' },
            },
            () => query.execute()
          );

          if (createdUser) {
            return {
              ...createdUser,
              emailVerified: Boolean(createdUser.emailVerified),
            };
          } else {
            throw new DatabaseOperationError('Cannot create user.');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async setUserEmailAsVerified(userId: User['id']): Promise<void> {
    return await this.instrumentationService.startSpan(
      { name: 'UserRepository > setUserEmailAsVerified' },
      async () => {
        await db
          .update(users)
          .set({ emailVerified: 1 })
          .where(eq(users.id, userId));
      }
    );
  }
}
