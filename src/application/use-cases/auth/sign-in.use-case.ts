import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { User } from '@/src/entities/models/user';

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

export const signInUseCase =
  (
    instrumentationService: IInstrumentationService,
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService
  ) =>
  (input: {
    email: string;
    password: string;
  }): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, 'id' | 'emailVerified'>;
  }> => {
    return instrumentationService.startSpan(
      { name: 'signIn Use Case', op: 'function' },
      async () => {
        const existingUser = await usersRepository.getUserByEmail(input.email);

        if (!existingUser) {
          throw new AuthenticationError('User does not exist');
        }

        const validPassword = await authenticationService.validatePasswords(
          input.password,
          existingUser.password
        );

        if (!validPassword) {
          throw new AuthenticationError('Incorrect username or password');
        }

        const { session, cookie } =
          await authenticationService.createSession(existingUser);

        return { session, cookie, user: existingUser };
      }
    );
  };
