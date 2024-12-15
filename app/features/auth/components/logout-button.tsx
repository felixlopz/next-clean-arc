'use client';

import { logoutAction } from '@/app/features/auth/actions';
import { Button } from '@/app/components/ui/button';

export default function LogoutButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        logoutAction();
      }}
      className="self-center"
    >
      Log out
    </Button>
  );
}
