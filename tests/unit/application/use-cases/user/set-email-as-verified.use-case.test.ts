import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

const setEmailAsVerifiedUseCase = getInjection('ISetEmailAsVerifiedUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('sets and returns an user with verified email', async () => {
  const result = await setEmailAsVerifiedUseCase('3');
  expect(result).toHaveProperty('emailVerified');
  expect(result?.emailVerified).toBe(true);
});

it('cant set the users email as verified', async () => {
  const result = await setEmailAsVerifiedUseCase('notfoundid');
  expect(result).toBe(undefined);
});
