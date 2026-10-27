const CARD_NUMBER_MAX_LENGTH = 19;
const SECURITY_CODE_MAX_LENGTH = 4;

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCardNumber(value: string): string {
  return onlyDigits(value)
    .slice(0, CARD_NUMBER_MAX_LENGTH)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpirationDate(value: string): string {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function formatSecurityCode(value: string): string {
  return onlyDigits(value).slice(0, SECURITY_CODE_MAX_LENGTH);
}

export function detectCardBrand(cardNumber: string): string | null {
  const digits = onlyDigits(cardNumber);
  if (/^4/.test(digits)) {
    return 'Visa';
  }
  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'Mastercard';
  }
  if (/^3[47]/.test(digits)) {
    return 'Amex';
  }
  return null;
}

export function passesLuhnCheck(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index--) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
