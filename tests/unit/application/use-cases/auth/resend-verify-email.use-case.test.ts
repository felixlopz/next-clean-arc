import { getInjection } from '@/di/container';
import { expect, it } from 'vitest';

const resendVerifyEmailUseCase = getInjection('IResendVerifyEmailUseCase');

it('resends a verification email', async () => {
  expect(resendVerifyEmailUseCase({ email: 'one@mail.com', userId: '1' }))
    .resolves;
});
