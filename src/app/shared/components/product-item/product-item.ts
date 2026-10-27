import { Component, input } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-item',
  template: `
    <div class="product-item">
      <span class="product-thumbnail" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </span>
      <div>
        <p class="text-sm font-semibold">{{ product().name }}</p>
        <p class="text-xs text-muted">{{ product().description }}</p>
      </div>
    </div>
  `,
  styleUrl: './product-item.scss',
})
export class ProductItem {
  readonly product = input.required<Product>();
}
