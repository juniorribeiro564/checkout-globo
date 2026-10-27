import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PaymentFailure, PaymentRequest, PaymentState } from '../models/payment.model';
import { createPaymentAttempt } from '../utils/payment.utils';
import { PaymentGatewayService } from './payment-gateway.service';

const INITIAL_STATE: PaymentState = { status: 'idle' };

/**
 * Holds the payment state shared by the payment, success and error screens.
 * The state lives in memory only, so a page refresh starts a new checkout.
 */
@Service()
export class PaymentService {
  private readonly paymentGatewayService = inject(PaymentGatewayService);
  private readonly router = inject(Router);
  private readonly stateSubject = new BehaviorSubject<PaymentState>(INITIAL_STATE);

  // Kept only so "Tentar novamente" can resend the same payment. Never exposed or persisted.
  private lastPaymentRequest: PaymentRequest | null = null;

  readonly state$ = this.stateSubject.asObservable();

  get currentState(): PaymentState {
    return this.stateSubject.value;
  }

  pay(request: PaymentRequest): void {
    if (this.currentState.status === 'processing') {
      return;
    }

    const attempt = createPaymentAttempt(request);
    this.lastPaymentRequest = request;
    this.stateSubject.next({ status: 'processing', attempt });

    this.paymentGatewayService.processPayment(request).subscribe({
      next: (receipt) => {
        this.lastPaymentRequest = null;
        this.stateSubject.next({ status: 'success', attempt, receipt });
        this.router.navigate(['/success']);
      },
      error: (failure: PaymentFailure) => {
        this.stateSubject.next({ status: 'error', attempt, failure });
        this.router.navigate(['/error']);
      },
    });
  }

  retry(): void {
    if (this.lastPaymentRequest) {
      this.pay(this.lastPaymentRequest);
    }
  }

  // PaymentPage resets the state when it opens, so the error screen does not flash empty.
  chooseAnotherPaymentMethod(): void {
    this.router.navigate(['/payment']);
  }

  reset(): void {
    this.lastPaymentRequest = null;
    this.stateSubject.next(INITIAL_STATE);
  }
}
