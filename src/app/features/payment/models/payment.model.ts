import { FormControl } from '@angular/forms';
import { PaymentMethod } from '../../../core/models/payment.model';
import { IconName } from '../../../shared/components/icon/icon';

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  icon: IconName;
}

export interface CardFormControls {
  cardNumber: FormControl<string>;
  holderName: FormControl<string>;
  expirationDate: FormControl<string>;
  securityCode: FormControl<string>;
}

export type CardFieldName = keyof CardFormControls;
