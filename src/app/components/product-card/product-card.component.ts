import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../interfaces/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group cursor-pointer"
         (click)="cardClick.emit(producto())">
      <div class="aspect-square overflow-hidden bg-gray-100">
        @if (producto().imagenUrl) {
          <img [src]="producto().imagenUrl"
               [alt]="producto().nombre"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               loading="lazy">
        } @else {
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        }
      </div>
      <div class="p-4">
        @if (producto().categoria) {
          <span class="text-xs font-medium text-blue-600 uppercase tracking-wide">{{ producto().categoria }}</span>
        }
        <h3 class="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">{{ producto().nombre }}</h3>
        <div class="mt-2 flex items-center justify-between">
          <span class="text-lg font-bold text-gray-900">{{ producto().precioVenta | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
          @if (producto().stockActual && producto().stockActual! > 0) {
            <button (click)="onAddToCart($event)"
                    class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
              Agregar
            </button>
          } @else {
            <span class="text-xs text-red-500 font-medium">Sin stock</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  producto = input.required<Producto>();
  addToCart = output<Producto>();
  cardClick = output<Producto>();

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.producto());
  }
}
