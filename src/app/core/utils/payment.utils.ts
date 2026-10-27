import { PaymentAttempt, PaymentMethod, PaymentRequest } from '../models/payment.model';
import { detectCardBrand, onlyDigits } from './card.utils';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  credit: 'Crédito',
  debit: 'Débito',
  pix: 'Pix',
};

/** Example: "Crédito · Visa •••• 4242". */
export function describePaymentMethod(request: PaymentRequest): string {
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[request.paymentMethod];
  if (!request.card) {
    return paymentMethodLabel;
  }

  const cardBrand = detectCardBrand(request.card.cardNumber) ?? 'Cartão';
  const lastFourDigits = onlyDigits(request.card.cardNumber).slice(-4);
  return `${paymentMethodLabel} · ${cardBrand} •••• ${lastFourDigits}`;
}

export function createPaymentAttempt(request: PaymentRequest): PaymentAttempt {
  return {
    orderNumber: request.orderNumber,
    amount: request.amount,
    paymentMethod: request.paymentMethod,
    paymentMethodDescription: describePaymentMethod(request),
  };
}
