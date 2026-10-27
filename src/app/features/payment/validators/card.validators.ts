import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { onlyDigits, passesLuhnCheck } from '../../../core/utils/card.utils';

const CARD_NUMBER_MIN_LENGTH = 13;
const CARD_NUMBER_MAX_LENGTH = 19;
const EXPIRATION_DATE_PATTERN = /^(0[1-9]|1[0-2])\/(\d{2})$/;

export function cardNumberValidator(control: AbstractControl<string>): ValidationErrors | null {
  const digits = onlyDigits(control.value ?? '');
  if (!digits) {
    return null;
  }

  const hasValidLength =
    digits.length >= CARD_NUMBER_MIN_LENGTH && digits.length <= CARD_NUMBER_MAX_LENGTH;
  return hasValidLength && passesLuhnCheck(digits) ? null : { invalidCardNumber: true };
}

export function expirationDateValidator(referenceDate = new Date()): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value ?? '';
    if (!value) {
      return null;
    }

    const match = EXPIRATION_DATE_PATTERN.exec(value);
    if (!match) {
      return { invalidExpirationDate: true };
    }

    const expirationMonth = Number(match[1]);
    const expirationYear = 2000 + Number(match[2]);
    const expirationMonthIndex = expirationYear * 12 + expirationMonth - 1;
    const referenceMonthIndex = referenceDate.getFullYear() * 12 + referenceDate.getMonth();

    return expirationMonthIndex < referenceMonthIndex ? { expiredCard: true } : null;
  };
}
