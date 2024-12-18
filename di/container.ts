import { createContainer } from '@evyweb/ioctopus';

import { DI_RETURN_TYPES, DI_SYMBOLS } from '@/di/types';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { createMonitoringModule } from '@/di/modules/monitoring.module';
import { createAuthenticationModule } from '@/di/modules/authentication.module';
import { createTransactionManagerModule } from '@/di/modules/database.module';
import { createUsersModule } from '@/di/modules/users.module';
import { createSessionsModule } from '@/di/modules/session.module';
import { createVerifyEmailRequestModule } from '@/di/modules/verify-email-request.module';
import { createEmailModule } from '@/di/modules/email.module';
import { createCommonModule } from '@/di/modules/common.module';

const ApplicationContainer = createContainer();

ApplicationContainer.load(Symbol('MonitoringModule'), createMonitoringModule());
ApplicationContainer.load(
  Symbol('TransactionManagerModule'),
  createTransactionManagerModule()
);
ApplicationContainer.load(
  Symbol('AuthenticationModule'),
  createAuthenticationModule()
);
ApplicationContainer.load(Symbol('UsersModule'), createUsersModule());
ApplicationContainer.load(Symbol('SessionsModule'), createSessionsModule());
ApplicationContainer.load(
  Symbol('VerifyEmailRequestModule'),
  createVerifyEmailRequestModule()
);

ApplicationContainer.load(Symbol('EmailService'), createEmailModule());
ApplicationContainer.load(Symbol('CommonService'), createCommonModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  const instrumentationService =
    ApplicationContainer.get<IInstrumentationService>(
      DI_SYMBOLS.IInstrumentationService
    );

  return instrumentationService.startSpan(
    {
      name: '(di) getInjection',
      op: 'function',
      attributes: { symbol: symbol.toString() },
    },
    () => ApplicationContainer.get(DI_SYMBOLS[symbol])
  );
}
