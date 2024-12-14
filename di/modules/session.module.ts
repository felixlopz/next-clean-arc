import { createModule } from '@evyweb/ioctopus';

import { SessionRepository } from '@/src/infrastructure/repositories/session.repository';

import { DI_SYMBOLS } from '@/di/types';

export function createSessionsModule() {
  const sessionsModule = createModule();

  if (process.env.NODE_ENV === 'test') {
  } else {
    sessionsModule
      .bind(DI_SYMBOLS.ISessionRepository)
      .toClass(SessionRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  return sessionsModule;
}
