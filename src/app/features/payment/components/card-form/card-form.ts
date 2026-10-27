import { Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Icon } from '../../../../shared/components/icon/icon';
import { PaymentMethod } from '../../../../core/models/payment.model';
import { CardFieldName, CardFormControls } from '../../models/payment.model';
import {
  detectCardBrand,
  formatCardNumber,
  formatExpirationDate,
  formatSecurityCode,
} from '../../../../core/utils/card.utils';

const CARD_ERROR_MESSAGES: Record<CardFieldName, Record<string, string>> = {
  cardNumber: {
    required: 'Informe o número do cartão.',
    invalidCardNumber: 'Número inválido. Confira os dígitos do cartão.',
  },
  holderName: {
    required: 'Informe o nome como aparece no cartão.',
    minlength: 'Informe o nome como aparece no cartão.',
  },
  expirationDate: {
    required: 'Informe a validade.',
    invalidExpirationDate: 'Use o formato MM/AA.',
    expiredCard: 'Cartão vencido.',
  },
  securityCode: {
    required: 'Informe o CVV.',
    pattern: 'Use 3 ou 4 dígitos.',
  },
};

@Component({
  selector: 'app-card-form',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './card-form.html',
  styleUrl: './card-form.scss',
})
export class CardForm {
  readonly cardForm = input.required<FormGroup<CardFormControls>>();
  readonly paymentMethod = input.required<PaymentMethod>();

  protected readonly title = computed(() =>
    this.paymentMethod() === 'debit' ? 'Cartão de débito' : 'Cartão de crédito',
  );

  protected get cardBrand(): string | null {
    return detectCardBrand(this.cardForm().controls.cardNumber.value);
  }

  protected isInvalid(fieldName: CardFieldName): boolean {
    const control = this.cardForm().controls[fieldName];
    return control.invalid && control.touched;
  }

  protected getErrorMessage(fieldName: CardFieldName): string {
    const errorKeys = Object.keys(this.cardForm().controls[fieldName].errors ?? {});
    return CARD_ERROR_MESSAGES[fieldName][errorKeys[0]] ?? '';
  }

  protected formatCardNumber(): void {
    const control = this.cardForm().controls.cardNumber;
    control.setValue(formatCardNumber(control.value), { emitEvent: false });
  }

  protected formatExpirationDate(): void {
    const control = this.cardForm().controls.expirationDate;
    control.setValue(formatExpirationDate(control.value), { emitEvent: false });
  }

  protected formatSecurityCode(): void {
    const control = this.cardForm().controls.securityCode;
    control.setValue(formatSecurityCode(control.value), { emitEvent: false });
  }
}
