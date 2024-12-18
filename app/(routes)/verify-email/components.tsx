'use client';

import { Input } from '@/app/components/ui/input';
import {
  resendEmailVerificationCodeAction,
  verifyEmailAction,
} from './actions';
import { useActionState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';

const emailVerificationInitialState = {
  message: '',
};

export function EmailVerificationForm() {
  const [state, action, isPending] = useActionState(
    verifyEmailAction,
    emailVerificationInitialState
  );
  return (
    <form action={action} className="flex gap-x-4">
      <div>
        <Input id="form-veryfy.code" name="code" required />
        <p className="mt-2 text-sm">{state.message}</p>
      </div>
      <Button variant="secondary" type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : 'Submit'}
      </Button>
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
    <form action={action} className="text-sm">
      {` Didn't recieve an email or code is expired?`}{' '}
      <Button type="submit" className="p-0 underline">
        Resend code
      </Button>
      <p>{state.message}</p>
    </form>
  );
}
