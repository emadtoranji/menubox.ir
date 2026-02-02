'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ActivePage({ nav }) {
  const pathname = usePathname();
  const currentPath = pathname?.trim() || '';

  if (!nav?.title || !nav?.path) {
    return null;
  }

  const isActive = currentPath === nav.path;
  const isSignIn = nav?.id === 'signin';
  const isSignOut = nav?.id === 'signout';

  return (
    <li className='nav-item d-flex justify-content-start justify-content-lg-center align-items-center'>
      <Link
        className={`nav-link ${isActive ? 'fw-bold' : 'fw-light'} ${
          isSignIn
            ? 'text-light'
            : isSignOut
              ? 'text-danger fw-bold'
              : 'text-light'
        }`}
        href={nav.path}
      >
        {nav.title}
      </Link>
    </li>
  );
}
