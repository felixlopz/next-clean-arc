import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { EmailService } from '@/src/infrastructure/services/email.service';

export function createEmailModule() {
  const emailModule = createModule();

  if (process.env.NODE_ENV === 'test') {
  } else {
    emailModule
      .bind(DI_SYMBOLS.IEmailService)
      .toClass(EmailService, [DI_SYMBOLS.IInstrumentationService]);
  }

  return emailModule;
}
