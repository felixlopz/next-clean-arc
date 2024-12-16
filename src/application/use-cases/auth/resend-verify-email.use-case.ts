import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { IVerifyEmailRequestRepository } from '@/src/application/repositories/verify-email-request.repository.interface';

interface ResendVerifyEmailInput {
  userId: string;
  email: string;
}

export type IResendVerifyEmailUseCase = ReturnType<
  typeof resendVerifyEmailUseCase
>;

export const resendVerifyEmailUseCase =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    verifyEmailRequestRepository: IVerifyEmailRequestRepository
  ) =>
  async (data: ResendVerifyEmailInput): Promise<void> => {
    return await instrumentationService.startSpan(
      { name: 'resendVerifyEmail UseCase' },
      async () => {
        const { email, userId } = data;

        await verifyEmailRequestRepository.deleteUserEmailVerificationRequest(
          userId
        );

        await authenticationService.createAndSendVerificationEmailRequest(
          userId,
          email
        );
      }
    );
  };
