import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

import { ISessionsRepository } from '@/src/application/repositories/session.repository.interface';
import {
  SessionFlags,
  Session,
  SessionValidationResult,
} from '@/src/entities/models/session';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { db } from '@/drizzle';
import { eq } from 'drizzle-orm';
import { sessions, users } from '@/drizzle/schema';
import {
  DatabaseOperationError,
  NotFoundError,
} from '@/src/entities/errors/common';
import { User } from '@/src/entities/models/user';
import { cache } from 'react';

export class SessionsRepository implements ISessionsRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async validateSessionToken(token: string): Promise<SessionValidationResult> {
    return await this.instrumentationService.startSpan(
      { name: 'UserRepository > validateSessionToken' },
      async () => {
        try {
          const sessionId = encodeHexLowerCase(
            sha256(new TextEncoder().encode(token))
          );

          const query = db
            .select()
            .from(sessions)
            .innerJoin(users, eq(users.id, sessions.userId))
            .where(eq(sessions.id, sessionId));

          const [data] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'pg' },
            },
            () => query.execute()
          );

          if (data == null) {
            throw new NotFoundError(
              `Session with session id:${sessionId} not found`
            );
          }

          const session: Session = {
            ...data.sessions,
            expiresAt: new Date(data.sessions.expiresAt * 1000),
          };

          const user: User = {
            ...data.users,
            emailVerified: Boolean(data.users.emailVerified),
          };

          if (Date.now() >= session.expiresAt.getTime()) {
            await db.delete(sessions).where(eq(sessions.id, sessionId));
            return { session: null, user: null };
          }

          if (
            Date.now() >=
            session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
          ) {
            session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
            await db
              .update(sessions)
              .set({
                ...session,
                expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
              })
              .where(eq(sessions.id, sessionId))
              .returning();
          }

          return { session, user };
        } catch (error) {
          this.crashReporterService.report(error);
          throw error; // TODO: convert to Entities error
        }
      }
    );
  }

  async generateSessionToken(): Promise<string> {
    return await this.instrumentationService.startSpan(
      { name: 'SessionRespository > generateSessionToken' },
      async () => {
        const tokenBytes = new Uint8Array(20);
        crypto.getRandomValues(tokenBytes);
        const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
        return token;
      }
    );
  }

  async createSession(
    token: string,
    userId: string,
    flags: SessionFlags
  ): Promise<Session> {
    return await this.instrumentationService.startSpan(
      { name: 'SessionRespository > generateSessionToken' },
      async () => {
        try {
          const sessionId = encodeHexLowerCase(
            sha256(new TextEncoder().encode(token))
          );

          const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

          const newSession: Session = {
            id: sessionId,
            userId,
            expiresAt,
            // twoFactorVerified: flags.twoFactorVerified,
          };

          const query = db
            .insert(sessions)
            .values({
              ...newSession,
              expiresAt: Math.floor(expiresAt.getTime() / 1000),
            })
            .returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'pg' },
            },
            () => query.execute()
          );

          if (created) {
            return { ...created, expiresAt };
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

  async getCurrentSession(
    sessionToken: string | undefined
  ): Promise<SessionValidationResult> {
    return await this.instrumentationService.startSpan(
      { name: 'SessionRepository > getCurrentSession' },
      async () => {
        if (sessionToken == null) {
          return { session: null, user: null };
        }
        const result = await this.validateSessionToken(sessionToken);
        return result;
      }
    );
  }

  async invalidateUserSession(userId: string): Promise<void> {
    return await this.instrumentationService.startSpan(
      { name: 'SessionRepository > invalidateUserSession' },
      async () => {
        try {
          await db.delete(sessions).where(eq(sessions.userId, userId));
        } catch (error) {
          this.crashReporterService.report(error);
          throw error; // TODO: convert to Entities error
        }
      }
    );
  }

  async invalidateSession(sessionId: string): Promise<void> {
    return await this.instrumentationService.startSpan(
      { name: 'SessionRepository > invalidateSession' },
      async () => {
        try {
          await db.delete(sessions).where(eq(sessions.id, sessionId));
        } catch (error) {
          this.crashReporterService.report(error);
          throw error; // TODO: convert to Entities error
        }
      }
    );
  }
}
