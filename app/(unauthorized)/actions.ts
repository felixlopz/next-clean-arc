'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';

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

      console.log('llego hasta aqui');

      // (await cookies()).set(
      //   sessionCookie.name,
      //   sessionCookie.value,
      //   sessionCookie.attributes
      // );

      // redirect('/');
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
