import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { PaymentState } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';
import { paymentSuccessGuard } from './payment-success.guard';

function runGuard(currentState: PaymentState): ReturnType<typeof paymentSuccessGuard> {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: PaymentService, useValue: { currentState } }],
  });

  return TestBed.runInInjectionContext(() =>
    paymentSuccessGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('paymentSuccessGuard', () => {
  it('should allow the success screen after an approved payment', () => {
    const result = runGuard({
      status: 'success',
      attempt: {
        orderNumber: 'NX-10482',
        amount: 79.9,
        paymentMethod: 'pix',
        paymentMethodDescription: 'Pix',
      },
      receipt: { paidAt: new Date() },
    });

    expect(result).toBe(true);
  });

  it('should redirect to the payment screen when there is no approved payment', () => {
    const result = runGuard({ status: 'idle' });

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/payment');
  });
});
