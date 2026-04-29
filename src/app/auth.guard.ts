import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

function hasRegistrationProof(): boolean {
  if (typeof window === 'undefined') return false;

  return Boolean(
    localStorage.getItem('isRegistered') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('authToken'),
  );
}

export const registeredGuard: CanActivateFn = () => {
  if (hasRegistrationProof()) {
    return true;
  }

  const router = inject(Router);
  return router.createUrlTree(['/register']);
};
