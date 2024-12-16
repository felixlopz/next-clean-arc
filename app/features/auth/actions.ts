'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { getInjection } from '@/di/container';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import { SESSION_COOKIE } from '@/config';
import { User } from '@/src/entities/models/user';

export async function loginAction(email: string, password: string) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signIn',
    { recordResponse: true },
    async () => {
      let existingUser: Pick<User, 'id' | 'emailVerified'>;

      try {
        const signInController = getInjection('ISignInController');
        const { cookie, user } = await signInController({ email, password });

        const storeCookie = await cookies();
        storeCookie.set(cookie.name, cookie.value, cookie.attributes);

        existingUser = user;
      } catch (error) {
        if (
          error instanceof InputParseError ||
          error instanceof AuthenticationError
        ) {
          return {
            error: 'Incorrect username or password',
          };
        }

        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(error);
        return {
          error:
            'An error happened. The developers have been notified. Please try again later.',
        };
      }

      if (!existingUser.emailVerified) {
        redirect('/verify-email');
      }

      redirect('/');
    }
  );
}

export async function signUp(name: string, email: string, password: string) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signUp',
    { recordResponse: true },

    async () => {
      let newUser: Pick<User, 'id' | 'emailVerified'>;

      try {
        const signUpController = getInjection('ISignUpController');

        const { cookie, user } = await signUpController({
          email,
          name,
          password,
        });

        const cookieStore = await cookies();
        cookieStore.set(cookie.name, cookie.value, cookie.attributes);

        newUser = user;
      } catch (err) {
        if (err instanceof InputParseError) {
          return {
            error:
              'Invalid data. Make sure the Password and Confirm Password match.',
          };
        }
        if (err instanceof AuthenticationError) {
          return {
            error: err.message,
          };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened. The developers have been notified. Please try again later. Message: ' +
            (err as Error).message,
        };
      }
      if (!newUser.emailVerified) {
        redirect('/verify-email');
      }

      redirect('/');
    }
  );
}

export async function signOut() {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signOut',
    { recordResponse: true },
    async () => {
      const storedCookie = await cookies();
      const sessionToken = storedCookie.get(SESSION_COOKIE)?.value;
      try {
        const signOutController = getInjection('ISignOutController');
        const blankCookie = await signOutController(sessionToken);

        storedCookie.set(
          blankCookie.name,
          blankCookie.value,
          blankCookie.attributes
        );

        redirect('/sign-in');
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof InputParseError
        ) {
          redirect('/sign-in');
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }
    }
  );
}
