import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductItem } from '../product-item/product-item';

export interface OrderDetail {
  label: string;
  value: string;
}

@Component({
  selector: 'app-order-details',
  imports: [CurrencyPipe, ProductItem],
  template: `
    <div class="order-details">
      <app-product-item [product]="product()" />
      <dl class="order-details-list">
        @for (detail of details(); track detail.label) {
          <div class="order-details-row">
            <dt>{{ detail.label }}</dt>
            <dd class="font-medium text-ink">{{ detail.value }}</dd>
          </div>
        }
        <div class="order-details-row order-details-total">
          <dt>{{ totalLabel() }}</dt>
          <dd>{{ total() | currency }}</dd>
        </div>
      </dl>
    </div>
  `,
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  readonly product = input.required<Product>();
  readonly details = input.required<OrderDetail[]>();
  readonly totalLabel = input.required<string>();
  readonly total = input.required<number>();
}
