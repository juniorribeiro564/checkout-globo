import { Service } from '@angular/core';
import { Observable, switchMap, throwError, timer, of } from 'rxjs';
import {
  PaymentFailure,
  PaymentFailureCode,
  PaymentReceipt,
  PaymentRequest,
} from '../models/payment.model';
import { onlyDigits } from '../utils/card.utils';

export const PROCESSING_DELAY = 2000;

const PAYMENT_FAILURES: Record<PaymentFailureCode, PaymentFailure> = {
  'card-declined': {
    code: 'card-declined',
    title: 'Cartão não autorizado',
    message:
      'Seu banco recusou esta transação. Confira os dados e o limite disponível ou use outro meio de pagamento.',
  },
  'insufficient-funds': {
    code: 'insufficient-funds',
    title: 'Saldo insuficiente',
    message:
      'O cartão não tem saldo ou limite suficiente para este valor. Tente outro cartão ou pague com Pix.',
  },
};

/** Test card numbers that force a failure. Any other valid card is approved. */
const FAILURE_CARD_NUMBERS: Record<string, PaymentFailureCode> = {
  '4000000000000002': 'card-declined',
  '4000000000009995': 'insufficient-funds',
};

/** Simulates the payment API. There is no real gateway behind it. */
@Service()
export class PaymentGatewayService {
  processPayment(request: PaymentRequest): Observable<PaymentReceipt> {
    const failure = this.findFailure(request);

    return timer(PROCESSING_DELAY).pipe(
      switchMap(() => (failure ? throwError(() => failure) : of({ paidAt: new Date() }))),
    );
  }

  private findFailure(request: PaymentRequest): PaymentFailure | null {
    if (!request.card) {
      return null;
    }

    const failureCode = FAILURE_CARD_NUMBERS[onlyDigits(request.card.cardNumber)];
    return failureCode ? PAYMENT_FAILURES[failureCode] : null;
  }
}
