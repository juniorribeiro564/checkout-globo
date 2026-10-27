import { FormControl } from '@angular/forms';
import { cardNumberValidator, expirationDateValidator } from './card.validators';

describe('cardNumberValidator', () => {
  it('should accept a number that passes the Luhn check', () => {
    expect(
      cardNumberValidator(new FormControl('4242 4242 4242 4242', { nonNullable: true })),
    ).toBeNull();
  });

  it('should reject a number that fails the Luhn check', () => {
    expect(
      cardNumberValidator(new FormControl('4242 4242 4242 4241', { nonNullable: true })),
    ).toEqual({
      invalidCardNumber: true,
    });
  });

  it('should leave empty values to the required validator', () => {
    expect(cardNumberValidator(new FormControl('', { nonNullable: true }))).toBeNull();
  });
});

describe('expirationDateValidator', () => {
  const validator = expirationDateValidator(new Date(2026, 9, 13));

  it('should accept the current month and future dates', () => {
    expect(validator(new FormControl('10/26'))).toBeNull();
    expect(validator(new FormControl('12/28'))).toBeNull();
  });

  it('should reject an expired card', () => {
    expect(validator(new FormControl('09/26'))).toEqual({ expiredCard: true });
  });

  it('should reject an invalid format', () => {
    expect(validator(new FormControl('13/28'))).toEqual({ invalidExpirationDate: true });
    expect(validator(new FormControl('1228'))).toEqual({ invalidExpirationDate: true });
  });
});
