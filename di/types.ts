import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { IEmailService } from '@/src/application/services/email.service.interface';

import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { ISessionsRepository } from '@/src/application/repositories/session.repository.interface';
import { IVerifyEmailRequestRepository } from '@/src/application/repositories/verify-email-request.repository.interface';

import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { IVerifyEmailUseCase } from '@/src/application/use-cases/auth/verify-user-email.use-case';
import { ISetEmailAsVerifiedUseCase } from '@/src/application/use-cases/user/set-email-as-verified.useCase';

import { ISignInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { ISignUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import { ISignOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { IVerifyEmailController } from '@/src/interface-adapters/controllers/auth/verify-email.controller';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),
  IEmailService: Symbol.for('IEmailService'),

  // Repositories
  IUsersRepository: Symbol.for('IUsersRepository'),
  ISessionsRepository: Symbol.for('ISessionsRepository'),
  IVerifyEmailRequestRepository: Symbol.for('IVerifyEmailRequestRepository'),

  // Use Cases
  ISignInUseCase: Symbol.for('ISignInUseCase'),
  ISignUpUseCase: Symbol.for('ISignUpUseCase'),
  ISignOutUseCase: Symbol.for('ISignOutUseCase'),
  ISetEmailAsVerifiedUseCase: Symbol.for('ISetEmailAsVerifiedUseCase'),
  IVerifyEmailUseCase: Symbol.for('IVerifyEmailUseCase'),

  // Controllers
  ISignInController: Symbol.for('ISignInController'),
  ISignUpController: Symbol.for('ISignUpController'),
  ISignOutController: Symbol.for('ISignOutController'),
  IVerifyEmailController: Symbol.for('IVerifyEmailController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;
  IEmailService: IEmailService;

  // Repositories
  IUsersRepository: IUsersRepository;
  ISessionsRepository: ISessionsRepository;
  IVerifyEmailRequestRepository: IVerifyEmailRequestRepository;

  // Use Cases
  ISignInUseCase: ISignInUseCase;
  ISignUpUseCase: ISignUpUseCase;
  ISignOutUseCase: ISignOutUseCase;
  ISetEmailAsVerifiedUseCase: ISetEmailAsVerifiedUseCase;
  IVerifyEmailUseCase: IVerifyEmailUseCase;

  // Controllers
  ISignInController: ISignInController;
  ISignUpController: ISignUpController;
  ISignOutController: ISignOutController;
  IVerifyEmailController: IVerifyEmailController;
}
