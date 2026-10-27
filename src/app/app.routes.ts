import { Routes } from '@angular/router';
import { paymentSuccessGuard } from './core/guards/payment-success.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'payment' },
  {
    path: 'payment',
    title: 'Pagamento | Nexo',
    loadComponent: () =>
      import('./features/payment/payment-page').then((module) => module.PaymentPage),
  },
  {
    path: 'success',
    title: 'Pagamento confirmado | Nexo',
    canActivate: [paymentSuccessGuard],
    loadComponent: () =>
      import('./features/success/success-page').then((module) => module.SuccessPage),
  },
  {
    path: 'error',
    title: 'Falha no pagamento | Nexo',
    loadComponent: () => import('./features/error/error-page').then((module) => module.ErrorPage),
  },
  { path: '**', redirectTo: 'payment' },
];
