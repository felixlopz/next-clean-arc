import { getInjection } from '@/di/container';
import LogoutButton from '@/app/features/auth/components/logout-button';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/config';

export default async function Home() {
  const storedCookie = await cookies();
  const authenticationService = getInjection('IAuthenticationService');
  const { user } = await authenticationService.validateSession(
    storedCookie.get(SESSION_COOKIE)?.value ?? null
  );

  return (
    <div className="max-w-screen-sm mx-auto flex flex-col items-center p-8">
      <span className="mb-4">Hello {user.name}</span>
      <LogoutButton />
    </div>
  );
}
