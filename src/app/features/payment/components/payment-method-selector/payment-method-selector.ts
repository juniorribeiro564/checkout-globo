import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Icon } from '../../../../shared/components/icon/icon';
import { PaymentMethod } from '../../../../core/models/payment.model';
import { PaymentMethodOption } from '../../models/payment.model';

const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  { value: 'credit', label: 'Crédito', icon: 'credit-card' },
  { value: 'debit', label: 'Débito', icon: 'credit-card' },
  { value: 'pix', label: 'Pix', icon: 'pix' },
];

@Component({
  selector: 'app-payment-method-selector',
  imports: [ReactiveFormsModule, Icon],
  template: `
    <fieldset class="payment-methods">
      <legend class="mb-3 text-lg font-medium">Como você quer pagar?</legend>
      <div class="payment-method-list">
        @for (option of paymentMethodOptions; track option.value) {
          <label class="payment-method">
            <input
              type="radio"
              class="payment-method-radio"
              name="paymentMethod"
              [value]="option.value"
              [formControl]="control()"
            />
            <app-icon [name]="option.icon" />
            <span>{{ option.label }}</span>
          </label>
        }
      </div>
    </fieldset>
  `,
  styleUrl: './payment-method-selector.scss',
})
export class PaymentMethodSelector {
  readonly control = input.required<FormControl<PaymentMethod>>();

  protected readonly paymentMethodOptions = PAYMENT_METHOD_OPTIONS;
}
