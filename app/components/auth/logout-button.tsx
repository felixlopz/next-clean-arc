'use client';

import { logoutAction } from '@/app/actions';
import { Button } from '../ui/button';

export default function LogoutButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        logoutAction();
      }}
    >
      Log out
    </Button>
  );
}
