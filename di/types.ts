import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { ISessionsRepository } from '@/src/application/repositories/session.repository.interface';

import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';

import { ISignInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { ISignUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),

  // Repositories
  IUsersRepository: Symbol.for('IUsersRepository'),
  ISessionsRepository: Symbol.for('ISessionsRepository'),

  // Use Cases
  ISignInUseCase: Symbol.for('ISignInUseCase'),
  ISignUpUseCase: Symbol.for('ISignUpUseCase'),

  // Controllers
  ISignInController: Symbol.for('ISignInController'),
  ISignUpController: Symbol.for('ISignUpController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;

  // Repositories
  IUsersRepository: IUsersRepository;
  ISessionsRepository: ISessionsRepository;

  ISignInUseCase: ISignInUseCase;
  ISignUpUseCase: ISignUpUseCase;

  // Controllers
  ISignInController: ISignInController;
  ISignUpController: ISignUpController;
}
