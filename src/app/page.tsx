'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

/**
 * Root page that redirects to landing page.
 * This serves as the entry point for the application.
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/landing');
  }, [router]);

  return null;
}
