import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');

// A great guide on test names
// // https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns session and cookie', async () => {
  const result = await signInUseCase({
    email: 'one@mail.com',
    password: 'password-one',
  });
  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
  expect(result).toHaveProperty('user');
  expect(result.session.userId).toBe('1');
});

it('throws for invalid input', () => {
  expect(() =>
    signInUseCase({ email: 'non-existing', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(AuthenticationError);

  expect(() =>
    signInUseCase({ email: 'one@mail.com', password: 'password-two' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});