'use server';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function logoutAction() {
  const storedCookie = await cookies();
  const authenticationService = getInjection('IAuthenticationService');
  const { blankCookie } = await authenticationService.invalidateSession(
    storedCookie.get(SESSION_COOKIE)?.value ?? null
  );

  storedCookie.set(blankCookie.name, blankCookie.value, blankCookie.attributes);
  return redirect('/sign-in');
}
