import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';
import { VerifyEmailRequestRepository } from '@/src/infrastructure/repositories/verify-email-request.repository';

export function createVerifyEmailRequestModule() {
  const verifyEmailRequestModule = createModule();

  if (process.env.NODE_ENV === 'test') {
  } else {
    verifyEmailRequestModule
      .bind(DI_SYMBOLS.IVerifyEmailRequestRepository)
      .toClass(VerifyEmailRequestRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
        DI_SYMBOLS.ICommonService,
      ]);
  }

  return verifyEmailRequestModule;
}
