import { Component, computed, input } from '@angular/core';
import { PaymentAttempt } from '../../../core/models/payment.model';
import { Product } from '../../../core/models/product.model';
import { Icon } from '../icon/icon';
import { OrderDetails } from '../order-details/order-details';
import { ResultCard } from '../result-card/result-card';

@Component({
  selector: 'app-payment-processing',
  imports: [Icon, OrderDetails, ResultCard],
  template: `
    <app-result-card
      status="processing"
      title="Processando seu pagamento"
      description="Estamos aguardando a confirmação. Isso pode levar alguns segundos."
      [headingLevel]="headingLevel()"
    >
      <app-order-details
        [product]="product()"
        [details]="details()"
        totalLabel="Total"
        [total]="attempt().amount"
      />

      <div class="notice notice--info" role="status">
        <app-icon name="info" />
        <div>
          <p class="font-semibold">Aguarde a confirmação</p>
          <p>Não feche esta página nem envie o pagamento novamente.</p>
        </div>
      </div>

      <p class="text-[0.6875rem] text-muted">Estado de processamento simulado</p>
    </app-result-card>
  `,
})
export class PaymentProcessing {
  readonly product = input.required<Product>();
  readonly attempt = input.required<PaymentAttempt>();
  readonly headingLevel = input<1 | 2>(1);

  protected readonly details = computed(() => [
    { label: 'Meio usado', value: this.attempt().paymentMethodDescription },
  ]);
}
