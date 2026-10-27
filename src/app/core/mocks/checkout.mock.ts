import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

export const PRODUCT_MOCK: Product = {
  id: 'nexo-pro-monthly',
  name: 'Nexo Pro',
  description: 'Plano mensal · 1 usuário',
  price: 79.9,
  taxes: 0,
  benefits: ['Projetos e tarefas ilimitados', 'Relatórios e automações', 'Suporte prioritário'],
  renewalNote: 'Renovação mensal. Cancele quando quiser, sem taxas adicionais.',
};

export const ORDER_MOCK: Order = {
  number: 'NX-10482',
  customerFirstName: 'Marina',
  customerEmail: 'marina.almeida@exemplo.com',
};

export const PIX_CODE_MOCK =
  '00020101021226840014br.gov.bcb.pix2562pix.nexo.demo/qr/NEXO-PRO-7990' +
  '52040000530398654057.905802BR5904NEXO6009SAO PAULO62070503***6304DEMO';
