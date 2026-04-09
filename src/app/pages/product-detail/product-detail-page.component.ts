import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart.service';
import { Producto } from '../../interfaces/models';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      } @else if (!producto()) {
        <div class="text-center py-20">
          <p class="text-gray-500 text-lg">Producto no encontrado.</p>
          <button (click)="router.navigate(['/productos'])"
                  class="mt-4 text-blue-600 hover:text-blue-800 font-medium">
            ← Volver a productos
          </button>
        </div>
      } @else {
        <button (click)="router.navigate(['/productos'])"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm mb-6 inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a productos
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <!-- Imagen -->
          <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            @if (producto()!.imagenUrl) {
              <img [src]="producto()!.imagenUrl"
                   [alt]="producto()!.nombre"
                   class="w-full h-full object-cover">
            } @else {
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            }
          </div>

          <!-- Info -->
          <div>
            @if (producto()!.categoria) {
              <span class="text-sm font-medium text-blue-600 uppercase tracking-wide">{{ producto()!.categoria }}</span>
            }
            <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ producto()!.nombre }}</h1>
            <p class="mt-2 text-sm text-gray-500">Código: {{ producto()!.codigo }}</p>

            @if (producto()!.descripcion) {
              <p class="mt-4 text-gray-600 leading-relaxed">{{ producto()!.descripcion }}</p>
            }

            <div class="mt-6">
              <span class="text-3xl font-bold text-gray-900">{{ producto()!.precioVenta | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
              <span class="text-sm text-gray-500 ml-2">(IVA incluido)</span>
            </div>

            <div class="mt-6">
              @if (producto()!.stockActual && producto()!.stockActual! > 0) {
                <span class="inline-flex items-center gap-1.5 text-sm text-green-600">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  En stock ({{ producto()!.stockActual }} disponibles)
                </span>
              } @else {
                <span class="inline-flex items-center gap-1.5 text-sm text-red-500">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  Sin stock
                </span>
              }
            </div>

            <!-- Cantidad + agregar -->
            @if (producto()!.stockActual && producto()!.stockActual! > 0) {
              <div class="mt-8 flex items-center gap-4">
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button (click)="decrementarCantidad()"
                          class="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">−</button>
                  <span class="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{{ cantidad() }}</span>
                  <button (click)="incrementarCantidad()"
                          class="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">+</button>
                </div>
                <button (click)="agregarAlCarrito()"
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Agregar al carrito
                </button>
              </div>

              @if (agregado()) {
                <p class="mt-3 text-green-600 text-sm font-medium">✓ Producto agregado al carrito</p>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ProductDetailPageComponent implements OnInit {
  private productoService = inject(ProductoService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  producto = signal<Producto | null>(null);
  loading = signal(true);
  cantidad = signal(1);
  agregado = signal(false);

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.productoService.getProducto(id).subscribe({
      next: (data) => {
        this.producto.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  incrementarCantidad(): void {
    const max = this.producto()?.stockActual ?? 99;
    if (this.cantidad() < max) {
      this.cantidad.update(c => c + 1);
    }
  }

  decrementarCantidad(): void {
    if (this.cantidad() > 1) {
      this.cantidad.update(c => c - 1);
    }
  }

  agregarAlCarrito(): void {
    const p = this.producto();
    if (p) {
      this.cartService.addItem(p, this.cantidad());
      this.agregado.set(true);
      setTimeout(() => this.agregado.set(false), 2000);
    }
  }
}
