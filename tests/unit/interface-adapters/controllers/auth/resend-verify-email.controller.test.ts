import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { expect, it } from 'vitest';

const signInController = getInjection('ISignInController');
const resendVerifyEmailController = getInjection(
  'IResendVerifyEmailController'
);

it('resends a verification email to user', async () => {
  const { session } = await signInController({
    email: 'one@mail.com',
    password: 'password-one',
  });

  expect(resendVerifyEmailController(session.id)).resolves;
});

it('throws for unatuhenticated error', async () => {
  await expect(resendVerifyEmailController(undefined)).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
});
