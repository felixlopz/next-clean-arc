import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const signOutController = getInjection('ISignOutController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns blank cookie', async () => {
  const { session } = await signInUseCase({
    email: 'one@mail.com',
    password: 'password-one',
  });

  await expect(signOutController(session.id)).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: '',
    attributes: {},
  });
});

it('throws for invalid input', async () => {
  await expect(signOutController(undefined)).rejects.toBeInstanceOf(
    InputParseError
  );
});
