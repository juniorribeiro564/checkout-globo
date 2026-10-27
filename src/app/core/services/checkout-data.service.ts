import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ORDER_MOCK, PRODUCT_MOCK } from '../mocks/checkout.mock';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

/** Stands in for the BFF that would serve the product and the open order. */
@Service()
export class CheckoutDataService {
  getProduct(): Observable<Product> {
    return of(PRODUCT_MOCK);
  }

  getOrder(): Observable<Order> {
    return of(ORDER_MOCK);
  }
}
