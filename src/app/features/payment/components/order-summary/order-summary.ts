import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { Icon } from '../../../../shared/components/icon/icon';
import { ProductItem } from '../../../../shared/components/product-item/product-item';

@Component({
  selector: 'app-order-summary',
  imports: [CurrencyPipe, Icon, ProductItem],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  readonly product = input.required<Product>();
  readonly showBenefits = input(true);

  protected readonly total = computed(() => this.product().price + this.product().taxes);
}
