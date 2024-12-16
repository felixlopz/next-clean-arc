import { expect, it } from 'vitest';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns blank cookie', async () => {
  const { session } = await signInUseCase({
    email: 'one@mail.com',
    password: 'password-one',
  });

  expect(signOutUseCase(session.id)).resolves.toMatchObject({
    blankCookie: {
      name: SESSION_COOKIE,
      value: '',
      attributes: {},
    },
  });
});
