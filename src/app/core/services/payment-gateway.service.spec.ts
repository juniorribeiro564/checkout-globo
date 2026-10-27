import { TestBed } from '@angular/core/testing';
import { CardData, PaymentRequest } from '../models/payment.model';
import { PaymentGatewayService, PROCESSING_DELAY } from './payment-gateway.service';

function createCardRequest(cardNumber: string): PaymentRequest {
  const card: CardData = {
    cardNumber,
    holderName: 'Marina Almeida',
    expirationDate: '12/28',
    securityCode: '123',
  };
  return { orderNumber: 'NX-10482', amount: 79.9, paymentMethod: 'credit', card };
}

describe('PaymentGatewayService', () => {
  let paymentGatewayService: PaymentGatewayService;

  beforeEach(() => {
    vi.useFakeTimers();
    paymentGatewayService = TestBed.inject(PaymentGatewayService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should approve a valid card after the processing delay', () => {
    const onSuccess = vi.fn();
    paymentGatewayService
      .processPayment(createCardRequest('4242 4242 4242 4242'))
      .subscribe(onSuccess);

    vi.advanceTimersByTime(PROCESSING_DELAY - 1);
    expect(onSuccess).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onSuccess).toHaveBeenCalledWith({ paidAt: expect.any(Date) });
  });

  it.each([
    ['4000 0000 0000 0002', 'card-declined'],
    ['4000 0000 0000 9995', 'insufficient-funds'],
  ])('should fail card %s with %s', (cardNumber, expectedCode) => {
    const onError = vi.fn();
    paymentGatewayService
      .processPayment(createCardRequest(cardNumber))
      .subscribe({ error: onError });

    vi.advanceTimersByTime(PROCESSING_DELAY);

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: expectedCode }));
  });

  it('should approve Pix payments', () => {
    const onSuccess = vi.fn();
    paymentGatewayService
      .processPayment({ orderNumber: 'NX-10482', amount: 79.9, paymentMethod: 'pix', card: null })
      .subscribe(onSuccess);

    vi.advanceTimersByTime(PROCESSING_DELAY);

    expect(onSuccess).toHaveBeenCalled();
  });
});
