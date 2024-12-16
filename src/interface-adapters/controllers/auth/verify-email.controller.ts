import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { User } from '@/src/entities/models/user';
import { IVerifyEmailUseCase } from '@/src/application/use-cases/auth/verify-user-email.use-case';
import { ISessionsRepository } from '@/src/application/repositories/session.repository.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import {
  VerificationCodeExpired,
  VerificationCodeInvalid,
} from '@/src/entities/errors/verify-email-request';
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
