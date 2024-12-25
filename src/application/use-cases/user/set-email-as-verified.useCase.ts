import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { User } from '@/src/entities/models/user';

export type ISetEmailAsVerifiedUseCase = ReturnType<
  typeof setEmailAsVerifiedUseCase
>;

export const setEmailAsVerifiedUseCase =
  (
    instrumentationService: IInstrumentationService,
    userRepository: IUsersRepository
  ) =>
  (userId: string): Promise<User | undefined> => {
    return instrumentationService.startSpan(
      { name: 'setUserEmailAsVerified Use Case', op: 'function' },
      async () => {
        return userRepository.setUserEmailAsVerified(userId);
      }
    );
  };
