import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signUpController = getInjection('ISignUpController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns cookie', async () => {
  const { cookie, user } = await signUpController({
    name: 'new',
    email: 'new@mail.com',
    password: 'password',
  });

  expect(user).toBeDefined();
  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: `random_session_id_${user.id}`,
    attributes: {},
  });
});

it('throws for invalid input', async () => {
  // empty object
  await expect(signUpController({})).rejects.toBeInstanceOf(InputParseError);

  // below min length
  await expect(
    signUpController({
      name: 'no',
      email: 'new@mail.com',
      password: 'no',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  // TODO: password strenght
  // wrong passwords
  //   expect(
  //     signUpController({
  //       name: 'new',
  //       password: 'password',
  //     })
  //   ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for existing email name', async () => {
  await expect(
    signUpController({
      name: 'one',
      email: 'one@mail.com',
      password: 'doesntmatter',
    })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
