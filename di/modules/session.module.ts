import { createModule } from '@evyweb/ioctopus';

import { SessionsRepository } from '@/src/infrastructure/repositories/session.repository';

import { DI_SYMBOLS } from '@/di/types';
import { MockSessionsRepository } from '@/src/infrastructure/repositories/session.repository.mock';

export function createSessionsModule() {
  const sessionsModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    sessionsModule
      .bind(DI_SYMBOLS.ISessionsRepository)
      .toClass(MockSessionsRepository);
  } else {
    sessionsModule
      .bind(DI_SYMBOLS.ISessionsRepository)
      .toClass(SessionsRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  return sessionsModule;
}
