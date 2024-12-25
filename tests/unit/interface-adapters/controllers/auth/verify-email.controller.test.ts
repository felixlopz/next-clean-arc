import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { expect, it } from 'vitest';

const verifyEmailController = getInjection('IVerifyEmailController');
const signInUseCase = getInjection('ISignInUseCase');

it('verifies user email controller', async () => {
  const code = '443901AA';

  const { session } = await signInUseCase({
    email: 'one@mail.com',
    password: 'password-one',
  });

  expect(verifyEmailController({ code }, session.id)).resolves;
});

it('throws for invalid input', async () => {
  await expect(
    verifyEmailController({ code: '' }, 'doesntmatter')
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    verifyEmailController({ code: 'some random large code' }, 'doesntmatter')
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    verifyEmailController({ code: 'tiny' }, 'doesntmatter')
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for unatuhenticated error', async () => {
  await expect(
    verifyEmailController({ code: 'ASDF5678' }, undefined)
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
