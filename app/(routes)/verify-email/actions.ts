'use server';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import {
  VerificationCodeExpired,
  VerificationCodeInvalid,
} from '@/src/entities/errors/verify-email-request';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface ActionResult {
  message: string;
}

export async function verifyEmailAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'verifyEmail',
    { recordResponse: true },
    async () => {
      try {
        const storedCookie = await cookies();
        const sessionId = storedCookie.get(SESSION_COOKIE)?.value;
        const verifyEmailController = getInjection('IVerifyEmailController');
        const code = formData.get('code');
        if (typeof code !== 'string') {
          return {
            message: 'Invalid or missing fields',
          };
        }

        await verifyEmailController({ code }, sessionId);
        redirect('/');
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof InputParseError ||
          err instanceof VerificationCodeInvalid ||
          err instanceof VerificationCodeExpired
        ) {
          return { message: err.message };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }
    }
  );
}

export async function resendEmailVerificationCodeAction(
  _prev: ActionResult
): Promise<ActionResult> {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'resendVerifyEmail',
    { recordResponse: true },
    async () => {
      try {
        const storedCookie = await cookies();
        const sessionId = storedCookie.get(SESSION_COOKIE)?.value;
        const verifyEmailController = getInjection(
          'IResendVerifyEmaiController'
        );

        await verifyEmailController(sessionId);
        return { message: 'new code sent to your email' };
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          return { message: err.message };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }
    }
  );
}
