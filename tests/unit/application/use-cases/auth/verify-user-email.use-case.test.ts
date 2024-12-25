import { getInjection } from '@/di/container';
import { NotFoundError } from '@/src/entities/errors/common';
import {
  VerificationCodeExpired,
  VerificationCodeInvalid,
} from '@/src/entities/errors/verify-email-request';
import { expect, it } from 'vitest';

const verifyUserEmailUseCase = getInjection('IVerifyEmailUseCase');

it('verifies user email use case', async () => {
  const result = await verifyUserEmailUseCase('1', '443901AA');
  expect(result).toBe(undefined);
});

it('throws for code invalid', async () => {
  await expect(
    verifyUserEmailUseCase('1', 'invalid_code')
  ).rejects.toBeInstanceOf(VerificationCodeInvalid);
});

it('throws for code expired', async () => {
  await expect(verifyUserEmailUseCase('2', '443902AA')).rejects.toBeInstanceOf(
    VerificationCodeExpired
  );
});

it('throws for request not exists for user', async () => {
  await expect(
    verifyUserEmailUseCase('not_found_id', 'doesntmatter')
  ).rejects.toBeInstanceOf(NotFoundError);
});
