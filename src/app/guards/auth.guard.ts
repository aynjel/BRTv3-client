import { CanActivateFn, Router } from '@angular/router';
import { decodeFromBase64 } from '../config/encryption';
import { inject } from '@angular/core';
import { storage } from '../config/storage';
import environment from 'src/environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  if (!environment.production) return true;
  const router = inject(Router);
  const storedAuth = storage.get('auth'); // Get auth from localStorage
  const params = route.queryParams['data'];

  // with params
  if (params) {
    storage.set('auth', decodeFromBase64(params));
    return true;
  } else {
    // no params
    if (storedAuth) return true; // -> continue

    // -> unauthorized
    router.navigate(['/unauthorized']);
    return false;
  }
};
