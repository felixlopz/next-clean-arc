import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

export type ISetEmailAsVerifiedUseCase = ReturnType<
  typeof setEmailAsVerifiedUseCase
>;

export const setEmailAsVerifiedUseCase =
  (
    instrumentationService: IInstrumentationService,
    userRepositoyr: IUsersRepository
  ) =>
  (userId: string): Promise<void> => {
    return instrumentationService.startSpan(
      { name: 'setUserEmailAsVerified Use Case', op: 'function' },
      async () => {
        return userRepositoyr.setUserEmailAsVerified(userId);
      }
    );
  };
