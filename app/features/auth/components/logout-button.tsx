'use client';

import { signOut } from '@/app/features/auth/actions';
import { Button } from '@/app/components/ui/button';

export default function LogoutButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        signOut();
      }}
      className="self-center"
    >
      Log out
    </Button>
  );
}
