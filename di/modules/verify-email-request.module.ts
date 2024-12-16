import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';
import { VerifyEmailRequestRepository } from '@/src/infrastructure/repositories/verify-email-request.repository';
import { verifyUserEmailController } from '@/src/interface-adapters/controllers/user/verify-email.controller';
import { verifyEmailUseCase } from '@/src/application/use-cases/user/verify-user-email.use-case';

export function createVerifyEmailRequestModule() {
  const verifyEmailRequestModule = createModule();

  if (process.env.NODE_ENV === 'test') {
  } else {
    verifyEmailRequestModule
      .bind(DI_SYMBOLS.IVerifyEmailRequestRepository)
      .toClass(VerifyEmailRequestRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  // Controllers
  verifyEmailRequestModule
    .bind(DI_SYMBOLS.IVerifyEmailController)
    .toHigherOrderFunction(verifyUserEmailController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IVerifyEmailUseCase,
      DI_SYMBOLS.ISetEmailAsVerifiedUseCase,
    ]);

  // Use Cases
  verifyEmailRequestModule
    .bind(DI_SYMBOLS.IVerifyEmailUseCase)
    .toHigherOrderFunction(verifyEmailUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IVerifyEmailRequestRepository,
    ]);

  return verifyEmailRequestModule;
}
