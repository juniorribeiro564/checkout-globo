import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PIX_CODE_MOCK } from '../../core/mocks/checkout.mock';
import { Order } from '../../core/models/order.model';
import { PaymentMethod } from '../../core/models/payment.model';
import { CheckoutDataService } from '../../core/services/checkout-data.service';
import { PaymentService } from '../../core/services/payment.service';
import { ViewportService } from '../../core/services/viewport.service';
import { CheckoutSteps } from '../../shared/components/checkout-steps/checkout-steps';
import { Icon } from '../../shared/components/icon/icon';
import { PaymentProcessing } from '../../shared/components/payment-processing/payment-processing';
import { CardForm } from './components/card-form/card-form';
import { OrderSummary } from './components/order-summary/order-summary';
import { PaymentMethodSelector } from './components/payment-method-selector/payment-method-selector';
import { PixPayment } from './components/pix-payment/pix-payment';
import { cardNumberValidator, expirationDateValidator } from './validators/card.validators';

const PAYMENT_STEP = 2;

@Component({
  selector: 'app-payment-page',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    ReactiveFormsModule,
    CheckoutSteps,
    Icon,
    OrderSummary,
    PaymentMethodSelector,
    CardForm,
    PixPayment,
    PaymentProcessing,
  ],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss',
})
export class PaymentPage implements OnInit, OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly checkoutDataService = inject(CheckoutDataService);
  private readonly paymentService = inject(PaymentService);
  private readonly viewportService = inject(ViewportService);
  private readonly destroy$ = new Subject<void>();

  protected readonly paymentStep = PAYMENT_STEP;
  protected readonly pixCode = PIX_CODE_MOCK;
  protected readonly product$ = this.checkoutDataService.getProduct();
  protected readonly order$ = this.checkoutDataService.getOrder();
  protected readonly paymentState$ = this.paymentService.state$;
  protected readonly isMobile$ = this.viewportService.isMobile$;
  protected readonly selectedPaymentMethod = signal<PaymentMethod>('credit');
  protected readonly hasSubmitAttempt = signal(false);

  protected readonly paymentForm = this.formBuilder.group({
    paymentMethod: this.formBuilder.control<PaymentMethod>('credit'),
    card: this.formBuilder.group({
      cardNumber: ['', [Validators.required, cardNumberValidator]],
      holderName: ['', [Validators.required, Validators.minLength(3)]],
      expirationDate: ['', [Validators.required, expirationDateValidator()]],
      securityCode: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    }),
  });

  ngOnInit(): void {
    // Coming back from the success or error screen starts a new attempt.
    if (this.paymentService.currentState.status !== 'processing') {
      this.paymentService.reset();
    }

    this.paymentForm.controls.paymentMethod.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentMethod) => this.changePaymentMethod(paymentMethod));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected submitPayment(order: Order, amount: number): void {
    this.hasSubmitAttempt.set(true);

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const { paymentMethod, card } = this.paymentForm.getRawValue();
    this.paymentService.pay({
      orderNumber: order.number,
      amount,
      paymentMethod,
      card: paymentMethod === 'pix' ? null : card,
    });
  }

  private changePaymentMethod(paymentMethod: PaymentMethod): void {
    this.selectedPaymentMethod.set(paymentMethod);
    this.hasSubmitAttempt.set(false);

    const cardGroup = this.paymentForm.controls.card;
    if (paymentMethod === 'pix') {
      cardGroup.disable();
    } else {
      cardGroup.enable();
    }
  }
}
