import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { IResendVerifyEmailUseCase } from '@/src/application/use-cases/auth/resend-verify-email.use-case';

export type IResendVerifyEmailController = ReturnType<
  typeof resendVerifyEmailController
>;

export const resendVerifyEmailController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    resendVerifyEmailUseCase: IResendVerifyEmailUseCase
  ) =>
  async (sessionId: string | undefined) => {
    return await instrumentationService.startSpan(
      { name: 'resendVerifyEmail Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError('Must be logged in to verify email');
        }

        const { user } = await authenticationService.validateSession(sessionId);

        await resendVerifyEmailUseCase({ userId: user.id, email: user.email });
      }
    );
  };
