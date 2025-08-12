import { Suspense } from 'react';

import { UserRegisterPage } from '@mod-auth/presentation/components/UserRegisterPage';

/**
 * User registration page route.
 * Handles new end-user registration (not businesses).
 */
export default function UserRegister() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserRegisterPage />
    </Suspense>
  );
}
