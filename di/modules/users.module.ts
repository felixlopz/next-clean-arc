import { createModule } from '@evyweb/ioctopus';

import { MockUsersRepository } from '@/src/infrastructure/repositories/user.respository.mock';
import { UsersRepository } from '@/src/infrastructure/repositories/user.repository';

import { DI_SYMBOLS } from '@/di/types';
import { verifyUserEmailController } from '@/src/interface-adapters/controllers/auth/verify-email.controller';
import { verifyEmailUseCase } from '@/src/application/use-cases/auth/verify-user-email.use-case';
import { setEmailAsVerifiedUseCase } from '@/src/application/use-cases/user/set-email-as-verified.useCase';

export function createUsersModule() {
  const usersModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    usersModule.bind(DI_SYMBOLS.IUsersRepository).toClass(MockUsersRepository);
  } else {
    usersModule
      .bind(DI_SYMBOLS.IUsersRepository)
      .toClass(UsersRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }
  // Use Cases
  usersModule
    .bind(DI_SYMBOLS.ISetEmailAsVerifiedUseCase)
    .toHigherOrderFunction(setEmailAsVerifiedUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IUsersRepository,
    ]);

  return usersModule;
}
