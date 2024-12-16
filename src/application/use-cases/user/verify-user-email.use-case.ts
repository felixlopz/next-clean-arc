import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IVerifyEmailRequestRepository } from '@/src/application/repositories/verify-email-request.repository.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

import { User } from '@/src/entities/models/user';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';
import {
  VerificationCodeExpired,
  VerificationCodeInvalid,
} from '@/src/entities/errors/verify-email-request';

export type IVerifyEmailUseCase = ReturnType<typeof verifyEmailUseCase>;

export const verifyEmailUseCase =
  (
    instrumentationService: IInstrumentationService,
    verifyEmailRequestRepository: IVerifyEmailRequestRepository
  ) =>
  (userId: User['id'], code: string): Promise<void> => {
    return instrumentationService.startSpan(
      { name: 'verifyEmail Use Case', op: 'function' },
      async () => {
        const verificationRequest =
          await verifyEmailRequestRepository.getUserEmailVerificationRequest(
            userId
          );

        if (verificationRequest == null) {
          throw new NotFoundError(
            'Email verification request for user does not exist'
          );
        }

        if (Date.now() >= verificationRequest.expiresAt.getTime()) {
          throw new VerificationCodeExpired('Code is expired');
        }

        if (verificationRequest.code !== code) {
          throw new VerificationCodeInvalid('Incorret code');
        }

        await verifyEmailRequestRepository.deleteUserEmailVerificationRequest(
          userId
        );
      }
    );
  };
