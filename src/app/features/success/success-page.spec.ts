import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { PaymentState } from '../../core/models/payment.model';
import { PaymentService } from '../../core/services/payment.service';
import { SuccessPage } from './success-page';

const SUCCESS_STATE: PaymentState = {
  status: 'success',
  attempt: {
    orderNumber: 'NX-10482',
    amount: 79.9,
    paymentMethod: 'credit',
    paymentMethodDescription: 'Crédito · Visa •••• 4242',
  },
  receipt: { paidAt: new Date(2026, 9, 13, 14, 32) },
};

describe('SuccessPage', () => {
  const reset = vi.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessPage],
      providers: [
        {
          provide: PaymentService,
          useValue: { state$: new BehaviorSubject<PaymentState>(SUCCESS_STATE), reset },
        },
      ],
    }).compileComponents();
  });

  it('should show the order and the payment method used', async () => {
    const fixture = TestBed.createComponent(SuccessPage);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent;

    expect(text).toContain('Pagamento confirmado!');
    expect(text).toContain('Tudo certo, Marina.');
    expect(text).toContain('#NX-10482');
    expect(text).toContain('Crédito · Visa •••• 4242');
    expect(text).toContain('13/10/2026, 14:32');
    expect(text).toContain('13/11/2026');
  });

  it('should clear the payment state when leaving the screen', () => {
    const fixture = TestBed.createComponent(SuccessPage);
    fixture.destroy();

    expect(reset).toHaveBeenCalled();
  });
});
