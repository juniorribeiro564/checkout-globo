import { PaymentRequest } from '../models/payment.model';
import { describePaymentMethod } from './payment.utils';

function createRequest(overrides: Partial<PaymentRequest>): PaymentRequest {
  return { orderNumber: 'NX-10482', amount: 79.9, paymentMethod: 'pix', card: null, ...overrides };
}

describe('describePaymentMethod', () => {
  const card = {
    cardNumber: '5555 5555 5555 4444',
    holderName: 'Marina Almeida',
    expirationDate: '12/28',
    securityCode: '123',
  };

  it('should describe a card payment with brand and last four digits', () => {
    expect(describePaymentMethod(createRequest({ paymentMethod: 'debit', card }))).toBe(
      'Débito · Mastercard •••• 4444',
    );
  });

  it('should describe a Pix payment', () => {
    expect(describePaymentMethod(createRequest({}))).toBe('Pix');
  });
});
