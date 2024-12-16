'use client';

import { Input } from '@/app/components/ui/input';
import {
  resendEmailVerificationCodeAction,
  verifyEmailAction,
} from './actions';
import { useActionState } from 'react';
import { Button } from '@/app/components/ui/button';

const emailVerificationInitialState = {
  message: '',
};

export function EmailVerificationForm() {
  const [state, action] = useActionState(
    verifyEmailAction,
    emailVerificationInitialState
  );
  return (
    <form action={action} className="flex gap-x-4">
      <Input id="form-veryfy.code" name="code" required />
      <Button variant="secondary" type="submit">
        Verify
      </Button>
      <p>{state.message}</p>
    </form>
  );
}

const resendEmailInitialState = {
  message: '',
};

export function ResendEmailVerificationCodeForm() {
  const [state, action] = useActionState(
    resendEmailVerificationCodeAction,
    resendEmailInitialState
  );
  return (
    <form action={action}>
      <Button variant="outline" type="submit">
        Resend code
      </Button>
      <p>{state.message}</p>
    </form>
  );
}
