import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
  },
  { path: '**', redirectTo: 'products' },
];
