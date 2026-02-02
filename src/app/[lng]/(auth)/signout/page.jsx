'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      const data = await signOut({ redirect: true, callbackUrl: '/signin' });

      if (data?.url) {
        router.redirect(data.url);
      } else {
        router.redirect('/signin');
      }
    };

    performSignOut();
  }, [router]);

  return null;
}
