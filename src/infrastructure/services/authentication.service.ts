import { compare } from 'bcrypt-ts';
import { createId } from '@paralleldrive/cuid2';

import { SESSION_COOKIE } from '@/config';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session, SessionFlags } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';

import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISessionsRepository } from '@/src/application/repositories/session.repository.interface';
import type { IVerifyEmailRequestRepository } from '@/src/application/repositories/verify-email-request.repository.interface';
import type { IEmailService } from '@/src/application/services/email.service.interface';

export class AuthenticationService implements IAuthenticationService {
  constructor(
    private readonly _usersRepository: IUsersRepository,
    private readonly _instrumentationService: IInstrumentationService,
    private readonly _sessionRepository: ISessionsRepository,
    private readonly _verifyEmailRequestRepository: IVerifyEmailRequestRepository,
    private readonly _emailService: IEmailService
  ) {}

  async validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean> {
    return this._instrumentationService.startSpan(
      { name: 'verify password hash', op: 'function' },
      async () => {
        return compare(inputPassword, usersHashedPassword);
      }
    );
  }

  async validateSession(
    sessionToken: string | null
  ): Promise<{ user: User; session: Session }> {
    if (sessionToken == null) {
      throw new UnauthenticatedError('Unauthenticated');
    }

    return await this._instrumentationService.startSpan(
      { name: 'AuthenticationService > validateSession' },
      async () => {
        const result = await this._instrumentationService.startSpan(
          { name: 'sessionRepository.validateSession', op: 'function' },
          () => this._sessionRepository.validateSessionToken(sessionToken)
        );

        if (!result.user || !result.session) {
          throw new UnauthenticatedError('Unauthenticated');
        }

        const user = await this._usersRepository.getUser(result.user.id);

        if (!user) {
          throw new UnauthenticatedError("User doesn't exist");
        }

        return { user, session: result.session };
      }
    );
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    return await this._instrumentationService.startSpan(
      { name: 'AuthenticationService > createSession' },

      async () => {
        const sessionFlags: SessionFlags = {
          twoFactorVerified: false,
        };
        const sessionToken =
          await this._sessionRepository.generateSessionToken();

        const session = await this._sessionRepository.createSession(
          sessionToken,
          user.id,
          sessionFlags
        );

        const cookie: Cookie = {
          name: SESSION_COOKIE,
          value: sessionToken,
          attributes: {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: session.expiresAt,
          },
        };

        return { session, cookie };
      }
    );
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    await this._sessionRepository.invalidateSession(sessionId);

    const blankCookie: Cookie = {
      name: SESSION_COOKIE,
      value: '',
      attributes: {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
      },
    };

    return { blankCookie };
  }

  generateUserId(): string {
    return this._instrumentationService.startSpan(
      { name: 'AuthenticationService > generateUserId', op: 'function' },
      () => createId()
    );
  }

  async createAndSendVerificationEmailRequest(
    userId: User['id'],
    email: string
  ): Promise<void> {
    return await this._instrumentationService.startSpan(
      { name: 'AuthenticationService > createAndSendVerificationEmailRequest' },
      async () => {
        const { code } =
          await this._verifyEmailRequestRepository.createEmailVerificationRequest(
            userId,
            email
          );

        await this._emailService.sendVerificationEmail(email, code);
      }
    );
  }
}
