import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signInController = getInjection('ISignInController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('signs in with valid input', async () => {
  const result = await signInController({
    email: 'one@mail.com',
    password: 'password-one',
  });
  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
  expect(result).toHaveProperty('user');
});

it('throws for invalid input', async () => {
  await expect(signInController({ email: '' })).rejects.toBeInstanceOf(
    InputParseError
  );

  await expect(signInController({ password: '' })).rejects.toBeInstanceOf(
    InputParseError
  );
  await expect(signInController({ email: 'no' })).rejects.toBeInstanceOf(
    InputParseError
  );
  await expect(signInController({ password: 'no' })).rejects.toBeInstanceOf(
    InputParseError
  );
  await expect(
    signInController({ email: 'one@mail.com', password: 'short' })
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(
    signInController({
      email: 'oneverylongusernamethatmakesnosense',
      password: 'short',
    })
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(
    signInController({
      email: 'one@mail.com',
      password: 'oneverylongpasswordthatmakesnosense',
    })
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(
    signInController({
      email: 'oneverylongusernamethatmakesnosense',
      password: 'oneverylongpasswordthatmakesnosense',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for invalid credentials', async () => {
  await expect(
    signInController({ email: 'nonexisting', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(
    signInController({ email: 'one@mail.com', password: 'wrongpass' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
