'use server';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function logoutAction() {
  const storedCookie = await cookies();

  const sessionsRepository = getInjection('ISessionsRepository');
  const { session, user } = await sessionsRepository.getCurrentSession(
    storedCookie.get(SESSION_COOKIE)?.value ?? null
  );

  if (session === null) {
    return {
      message: 'Not authenticated',
    };
  }

  await sessionsRepository.invalidateUserSession(user.id);
  storedCookie.set(SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  return redirect('/sign-in');
}
