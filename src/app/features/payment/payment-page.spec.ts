import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentService } from '../../core/services/payment.service';
import { PaymentPage } from './payment-page';

describe('PaymentPage', () => {
  let fixture: ComponentFixture<PaymentPage>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaymentPage] }).compileComponents();
    fixture = TestBed.createComponent(PaymentPage);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  function selectPaymentMethod(optionLabel: string): Promise<void> {
    const optionLabels = element.querySelectorAll<HTMLLabelElement>('.payment-method');
    Array.from(optionLabels)
      .find((label) => label.textContent?.includes(optionLabel))
      ?.click();
    return fixture.whenStable();
  }

  it('should show the product and the credit card form by default', () => {
    expect(element.textContent).toContain('Nexo Pro');
    expect(element.textContent).toContain('Cartão de crédito');
    expect(element.querySelector('#card-number')).not.toBeNull();
  });

  it('should show field errors when submitting an empty card form', async () => {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await fixture.whenStable();

    expect(element.textContent).toContain('Informe o número do cartão.');
    expect(element.textContent).toContain('Corrija os campos destacados para continuar.');
  });

  it('should show the Pix payment when Pix is selected', async () => {
    await selectPaymentMethod('Pix');

    expect(element.querySelector('#card-number')).toBeNull();
    expect(element.textContent).toContain('Pix copia e cola');
  });

  it('should rename the card form when debit is selected', async () => {
    await selectPaymentMethod('Débito');

    expect(element.textContent).toContain('Cartão de débito');
  });

  it('should send a valid card payment without the form state', async () => {
    const pay = vi.spyOn(TestBed.inject(PaymentService), 'pay').mockImplementation(() => {});
    typeInto('card-number', '4242424242424242');
    typeInto('holder-name', 'Marina Almeida');
    typeInto('expiration-date', '1228');
    typeInto('security-code', '123');

    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await fixture.whenStable();

    expect(pay).toHaveBeenCalledWith({
      orderNumber: 'NX-10482',
      amount: 79.9,
      paymentMethod: 'credit',
      card: {
        cardNumber: '4242 4242 4242 4242',
        holderName: 'Marina Almeida',
        expirationDate: '12/28',
        securityCode: '123',
      },
    });
  });

  it('should send a Pix payment without card data', async () => {
    const pay = vi.spyOn(TestBed.inject(PaymentService), 'pay').mockImplementation(() => {});
    await selectPaymentMethod('Pix');

    Array.from(element.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('Concluir pagamento'))
      ?.click();

    expect(pay).toHaveBeenCalledWith(expect.objectContaining({ paymentMethod: 'pix', card: null }));
  });

  function typeInto(inputId: string, value: string): void {
    const input = element.querySelector<HTMLInputElement>(`#${inputId}`);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  }
});
