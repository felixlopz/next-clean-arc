import { getInjection } from '@/di/container';
import LogoutButton from '@/app/features/auth/components/logout-button';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/config';
import { redirect } from 'next/navigation';

export default async function Home() {
  const storedCookie = await cookies();
  const sessionRepository = getInjection('ISessionsRepository');

  const { session, user } = await sessionRepository.getCurrentSession(
    storedCookie.get(SESSION_COOKIE)?.value ?? undefined
  );

  if (session == null) {
    redirect('/sign-in');
  }

  if (!user.emailVerified) {
    return redirect('/verify-email');
  }

  return (
    <div className="max-w-screen-sm mx-auto flex flex-col items-center p-8">
      <span className="mb-4">Hello {user.name}</span>
      <LogoutButton />
    </div>
  );
}
