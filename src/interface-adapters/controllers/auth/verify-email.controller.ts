import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IVerifyEmailUseCase } from '@/src/application/use-cases/auth/verify-user-email.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ISetEmailAsVerifiedUseCase } from '@/src/application/use-cases/user/set-email-as-verified.useCase';

const inputSchema = z.object({
  code: z.string(),
});

export type IVerifyEmailController = ReturnType<
  typeof verifyUserEmailController
>;

export const verifyUserEmailController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    verifyEmailUseCase: IVerifyEmailUseCase,
    setEmailAsVerifiedUseCase: ISetEmailAsVerifiedUseCase
  ) =>
  async (
    input: z.infer<typeof inputSchema>,
    sessionId: string | undefined
  ): Promise<void> => {
    return await instrumentationService.startSpan(
      { name: 'verifyEmail Controller' },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        if (!sessionId) {
          throw new UnauthenticatedError('Must be logged in to verify email');
        }

        const { user } = await authenticationService.validateSession(sessionId);

        await verifyEmailUseCase(user.id, data.code);
        await setEmailAsVerifiedUseCase(user.id);
      }
    );
  };
