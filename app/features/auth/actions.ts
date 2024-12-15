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

export async function loginAction(email: string, password: string) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signIn',
    { recordResponse: true },
    async () => {
      let sessionCookie: Cookie;
      try {
        const signInController = getInjection('ISignInController');
        sessionCookie = await signInController({ email, password });
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

      const storeCookie = await cookies();
      storeCookie.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
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
      let sessionCookie: Cookie;
      try {
        const signUpController = getInjection('ISignUpController');

        const { cookie } = await signUpController({
          email,
          name,
          password,
        });

        sessionCookie = cookie;

        console.log(sessionCookie);
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
      const cookieStore = await cookies();
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
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

      let blankCookie: Cookie;
      try {
        const signOutController = getInjection('ISignOutController');
        blankCookie = await signOutController(sessionToken);
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

      storedCookie.set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes
      );

      redirect('/sign-in');
    }
  );
}
