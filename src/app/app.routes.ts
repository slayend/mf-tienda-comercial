import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './components/store-layout/store-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent) },
      { path: 'productos', loadComponent: () => import('./pages/productos/productos-page.component').then(m => m.ProductosPageComponent) },
      { path: 'productos/:id', loadComponent: () => import('./pages/product-detail/product-detail-page.component').then(m => m.ProductDetailPageComponent) },
      { path: 'carrito', loadComponent: () => import('./pages/cart/cart-page.component').then(m => m.CartPageComponent) },
      { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout-page.component').then(m => m.CheckoutPageComponent) },
      { path: 'pedido-confirmado', loadComponent: () => import('./pages/pedido-confirmado/pedido-confirmado-page.component').then(m => m.PedidoConfirmadoPageComponent) },
      { path: 'seguimiento', loadComponent: () => import('./pages/seguimiento/seguimiento-page.component').then(m => m.SeguimientoPageComponent) },
      { path: '**', redirectTo: '' },
    ],
  },
];
