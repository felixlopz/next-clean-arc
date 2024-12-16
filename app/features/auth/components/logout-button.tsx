'use client';

import { signOut } from '@/app/features/auth/actions';
import { Button, ButtonProps } from '@/app/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LogoutButton(props: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        await signOut();
        setIsLoading(false);
      }}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : 'Logout'}
    </Button>
  );
}
