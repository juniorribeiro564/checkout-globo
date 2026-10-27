import { AsyncPipe, DatePipe, formatDate } from '@angular/common';
import { Component, inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Order } from '../../core/models/order.model';
import { PaymentAttempt, PaymentReceipt } from '../../core/models/payment.model';
import { Product } from '../../core/models/product.model';
import { CheckoutDataService } from '../../core/services/checkout-data.service';
import { PaymentService } from '../../core/services/payment.service';
import { CheckoutSteps } from '../../shared/components/checkout-steps/checkout-steps';
import { Icon } from '../../shared/components/icon/icon';
import { OrderDetail, OrderDetails } from '../../shared/components/order-details/order-details';
import { ResultCard } from '../../shared/components/result-card/result-card';

const ALL_STEPS_COMPLETED = 4;

interface SuccessViewModel {
  product: Product;
  order: Order;
  attempt: PaymentAttempt;
  details: OrderDetail[];
  nextRenewalDate: Date;
}

@Component({
  selector: 'app-success-page',
  imports: [AsyncPipe, DatePipe, CheckoutSteps, Icon, OrderDetails, ResultCard],
  templateUrl: './success-page.html',
})
export class SuccessPage implements OnDestroy {
  private readonly checkoutDataService = inject(CheckoutDataService);
  private readonly paymentService = inject(PaymentService);
  private readonly locale = inject(LOCALE_ID);

  protected readonly allStepsCompleted = ALL_STEPS_COMPLETED;

  protected readonly viewModel$ = combineLatest([
    this.paymentService.state$,
    this.checkoutDataService.getProduct(),
    this.checkoutDataService.getOrder(),
  ]).pipe(
    map(([paymentState, product, order]) =>
      paymentState.status === 'success'
        ? this.createViewModel(product, order, paymentState.attempt, paymentState.receipt)
        : null,
    ),
  );

  // The confirmation is shown once: leaving this screen clears the payment state.
  ngOnDestroy(): void {
    this.paymentService.reset();
  }

  protected printReceipt(): void {
    window.print();
  }

  private createViewModel(
    product: Product,
    order: Order,
    attempt: PaymentAttempt,
    receipt: PaymentReceipt,
  ): SuccessViewModel {
    const nextRenewalDate = new Date(receipt.paidAt);
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

    return {
      product,
      order,
      attempt,
      nextRenewalDate,
      details: [
        { label: 'Pedido', value: `#${attempt.orderNumber}` },
        { label: 'Pagamento', value: attempt.paymentMethodDescription },
        { label: 'Data', value: formatDate(receipt.paidAt, 'dd/MM/yyyy, HH:mm', this.locale) },
      ],
    };
  }
}
