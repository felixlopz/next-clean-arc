import LogoutButton from '@/app/features/auth/components/logout-button';
import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  EmailVerificationForm,
  ResendEmailVerificationCodeForm,
} from './components';

export default async function VerifyEmailPage() {
  const storedCookie = await cookies();
  const sessionRepository = getInjection('ISessionsRepository');
  const { session, user } = await sessionRepository.getCurrentSession(
    storedCookie.get(SESSION_COOKIE)?.value ?? undefined
  );

  if (session == null) {
    redirect('/sign-in');
  }

  const verifyEmailRequestRepository = getInjection(
    'IVerifyEmailRequestRepository'
  );

  const verificationrRequest =
    verifyEmailRequestRepository.getUserEmailVerificationRequest(user.email);

  if (verificationrRequest == null && user.emailVerified) {
    return redirect('/');
  }

  return (
    <div className="max-w-screen-md mx-auto mt-8 flex flex-col gap-y-4 items-center">
      <div>
        <span className="text-md">
          Please verify your email: {user.email} or{' '}
        </span>
        <LogoutButton variant="link" className="text-secondary p-0 underline">
          Logout
        </LogoutButton>
      </div>
      <EmailVerificationForm />
      <div className="flex gap-x-4">
        <ResendEmailVerificationCodeForm />
      </div>
    </div>
  );
}
