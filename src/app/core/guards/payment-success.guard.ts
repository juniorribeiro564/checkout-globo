import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';

/** The success screen only opens right after an approved payment. */
export const paymentSuccessGuard: CanActivateFn = () => {
  const paymentService = inject(PaymentService);
  const router = inject(Router);

  return paymentService.currentState.status === 'success' || router.createUrlTree(['/payment']);
};
