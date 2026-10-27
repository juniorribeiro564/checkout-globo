import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PaymentFailure, PaymentReceipt, PaymentRequest } from '../models/payment.model';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentService } from './payment.service';

const PAYMENT_REQUEST: PaymentRequest = {
  orderNumber: 'NX-10482',
  amount: 79.9,
  paymentMethod: 'credit',
  card: {
    cardNumber: '4242 4242 4242 4242',
    holderName: 'Marina Almeida',
    expirationDate: '12/28',
    securityCode: '123',
  },
};

const PAYMENT_FAILURE: PaymentFailure = {
  code: 'card-declined',
  title: 'Cartão não autorizado',
  message: 'Seu banco recusou esta transação.',
};

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let gatewayResponse: Subject<PaymentReceipt>;
  let processPayment: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    processPayment = vi.fn(() => {
      gatewayResponse = new Subject<PaymentReceipt>();
      return gatewayResponse;
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PaymentGatewayService, useValue: { processPayment } },
      ],
    });

    paymentService = TestBed.inject(PaymentService);
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  it('should start idle', () => {
    expect(paymentService.currentState).toEqual({ status: 'idle' });
  });

  it('should move to processing without exposing card data', () => {
    paymentService.pay(PAYMENT_REQUEST);

    expect(paymentService.currentState).toEqual({
      status: 'processing',
      attempt: {
        orderNumber: 'NX-10482',
        amount: 79.9,
        paymentMethod: 'credit',
        paymentMethodDescription: 'Crédito · Visa •••• 4242',
      },
    });
  });

  it('should store the receipt and open the success screen when approved', () => {
    const receipt = { paidAt: new Date(2026, 9, 13, 14, 32) };

    paymentService.pay(PAYMENT_REQUEST);
    gatewayResponse.next(receipt);

    expect(paymentService.currentState).toEqual(
      expect.objectContaining({ status: 'success', receipt }),
    );
    expect(navigate).toHaveBeenCalledWith(['/success']);
  });

  it('should store the failure and open the error screen when declined', () => {
    paymentService.pay(PAYMENT_REQUEST);
    gatewayResponse.error(PAYMENT_FAILURE);

    expect(paymentService.currentState).toEqual(
      expect.objectContaining({ status: 'error', failure: PAYMENT_FAILURE }),
    );
    expect(navigate).toHaveBeenCalledWith(['/error']);
  });

  it('should resend the last request on retry', () => {
    paymentService.pay(PAYMENT_REQUEST);
    gatewayResponse.error(PAYMENT_FAILURE);

    paymentService.retry();

    expect(processPayment).toHaveBeenCalledTimes(2);
    expect(processPayment).toHaveBeenLastCalledWith(PAYMENT_REQUEST);
    expect(paymentService.currentState.status).toBe('processing');
  });

  it('should ignore a new payment while one is processing', () => {
    paymentService.pay(PAYMENT_REQUEST);
    paymentService.pay(PAYMENT_REQUEST);

    expect(processPayment).toHaveBeenCalledTimes(1);
  });

  it('should not retry after a reset', () => {
    paymentService.pay(PAYMENT_REQUEST);
    gatewayResponse.error(PAYMENT_FAILURE);
    paymentService.reset();

    paymentService.retry();

    expect(processPayment).toHaveBeenCalledTimes(1);
    expect(paymentService.currentState).toEqual({ status: 'idle' });
  });
});
