import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { PaymentAttempt } from '../../core/models/payment.model';
import { CheckoutDataService } from '../../core/services/checkout-data.service';
import { PaymentService } from '../../core/services/payment.service';
import { CheckoutSteps } from '../../shared/components/checkout-steps/checkout-steps';
import { Icon } from '../../shared/components/icon/icon';
import { OrderDetail, OrderDetails } from '../../shared/components/order-details/order-details';
import { PaymentProcessing } from '../../shared/components/payment-processing/payment-processing';
import { ResultCard } from '../../shared/components/result-card/result-card';

const PAYMENT_STEP = 2;

@Component({
  selector: 'app-error-page',
  imports: [
    AsyncPipe,
    RouterLink,
    CheckoutSteps,
    Icon,
    OrderDetails,
    PaymentProcessing,
    ResultCard,
  ],
  templateUrl: './error-page.html',
})
export class ErrorPage {
  private readonly checkoutDataService = inject(CheckoutDataService);
  private readonly paymentService = inject(PaymentService);

  protected readonly paymentStep = PAYMENT_STEP;

  protected readonly viewModel$ = combineLatest([
    this.paymentService.state$,
    this.checkoutDataService.getProduct(),
  ]).pipe(map(([paymentState, product]) => ({ paymentState, product })));

  protected getDetails(attempt: PaymentAttempt): OrderDetail[] {
    return [
      { label: 'Pedido', value: `#${attempt.orderNumber}` },
      { label: 'Meio usado', value: attempt.paymentMethodDescription },
    ];
  }

  protected retryPayment(): void {
    this.paymentService.retry();
  }

  protected chooseAnotherPaymentMethod(): void {
    this.paymentService.chooseAnotherPaymentMethod();
  }
}
