import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrito de compras</h1>

      @if (cartService.items().length === 0) {
        <div class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p class="mt-4 text-gray-500 text-lg">Tu carrito está vacío</p>
          <button (click)="router.navigate(['/productos'])"
                  class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            Ver productos
          </button>
        </div>
      } @else {
        <div class="space-y-4">
          @for (item of cartService.items(); track item.producto.id) {
            <div class="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4">
              <!-- Imagen -->
              <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                @if (item.producto.imagenUrl) {
                  <img [src]="item.producto.imagenUrl" [alt]="item.producto.nombre"
                       class="w-full h-full object-cover">
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                }
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">{{ item.producto.nombre }}</h3>
                <p class="text-sm text-gray-500">{{ item.producto.precioVenta | currency:'CLP':'symbol-narrow':'1.0-0' }} c/u</p>
              </div>

              <!-- Cantidad -->
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button (click)="cartService.updateQuantity(item.producto.id, item.cantidad - 1)"
                        class="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm">−</button>
                <span class="px-3 py-1.5 font-medium text-gray-900 text-sm min-w-[2.5rem] text-center">{{ item.cantidad }}</span>
                <button (click)="cartService.updateQuantity(item.producto.id, item.cantidad + 1)"
                        class="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm">+</button>
              </div>

              <!-- Subtotal -->
              <div class="text-right shrink-0 w-28">
                <span class="font-semibold text-gray-900">{{ item.producto.precioVenta * item.cantidad | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
              </div>

              <!-- Eliminar -->
              <button (click)="cartService.removeItem(item.producto.id)"
                      class="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          }
        </div>

        <!-- Resumen -->
        <div class="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 class="font-semibold text-gray-900 text-lg mb-4">Resumen del pedido</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal ({{ cartService.totalItems() }} productos)</span>
              <span>{{ cartService.subtotal() | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>IVA (19%)</span>
              <span>{{ cartService.iva() | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
            </div>
            <div class="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>{{ cartService.total() | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
            </div>
          </div>
          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button (click)="router.navigate(['/productos'])"
                    class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors text-center">
              Seguir comprando
            </button>
            <button (click)="router.navigate(['/checkout'])"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Proceder al pago
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class CartPageComponent {
  cartService = inject(CartService);
  router = inject(Router);
}
