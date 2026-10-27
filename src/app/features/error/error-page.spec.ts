import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PaymentState } from '../../core/models/payment.model';
import { PaymentService } from '../../core/services/payment.service';
import { ErrorPage } from './error-page';

const ERROR_STATE: PaymentState = {
  status: 'error',
  attempt: {
    orderNumber: 'NX-10482',
    amount: 79.9,
    paymentMethod: 'credit',
    paymentMethodDescription: 'Crédito · Visa •••• 0002',
  },
  failure: {
    code: 'card-declined',
    title: 'Cartão não autorizado',
    message: 'Seu banco recusou esta transação.',
  },
};

describe('ErrorPage', () => {
  let state$: BehaviorSubject<PaymentState>;
  const retry = vi.fn();
  const chooseAnotherPaymentMethod = vi.fn();

  async function renderErrorPage(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(ErrorPage);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  function findButton(element: HTMLElement, label: string): HTMLButtonElement | undefined {
    return Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes(label),
    );
  }

  beforeEach(async () => {
    state$ = new BehaviorSubject<PaymentState>(ERROR_STATE);
    await TestBed.configureTestingModule({
      imports: [ErrorPage],
      providers: [
        provideRouter([]),
        { provide: PaymentService, useValue: { state$, retry, chooseAnotherPaymentMethod } },
      ],
    }).compileComponents();
  });

  it('should explain what failed', async () => {
    const element = await renderErrorPage();

    expect(element.textContent).toContain('Não foi possível concluir o pagamento');
    expect(element.textContent).toContain('Cartão não autorizado');
    expect(element.textContent).toContain('Crédito · Visa •••• 0002');
  });

  it('should retry or go back to choose another payment method', async () => {
    const element = await renderErrorPage();

    findButton(element, 'Tentar novamente')?.click();
    findButton(element, 'Escolher outro meio')?.click();

    expect(retry).toHaveBeenCalled();
    expect(chooseAnotherPaymentMethod).toHaveBeenCalled();
  });

  it('should show an empty state when opened without a failed payment', async () => {
    state$.next({ status: 'idle' });
    const element = await renderErrorPage();

    expect(element.textContent).toContain('Nenhum pagamento para revisar');
    expect(element.querySelector('a[href="/payment"]')).not.toBeNull();
  });
});
