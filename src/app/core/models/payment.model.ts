export type PaymentMethod = 'credit' | 'debit' | 'pix';

export interface CardData {
  cardNumber: string;
  holderName: string;
  expirationDate: string;
  securityCode: string;
}

export interface PaymentRequest {
  orderNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  card: CardData | null;
}

/** What can be shown on screen about a payment. Never holds card data. */
export interface PaymentAttempt {
  orderNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodDescription: string;
}

export interface PaymentReceipt {
  paidAt: Date;
}

export type PaymentFailureCode = 'card-declined' | 'insufficient-funds';

export interface PaymentFailure {
  code: PaymentFailureCode;
  title: string;
  message: string;
}

export type PaymentState =
  | { status: 'idle' }
  | { status: 'processing'; attempt: PaymentAttempt }
  | { status: 'success'; attempt: PaymentAttempt; receipt: PaymentReceipt }
  | { status: 'error'; attempt: PaymentAttempt; failure: PaymentFailure };
