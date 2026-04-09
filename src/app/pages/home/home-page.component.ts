import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart.service';
import { Producto, CategoriaProducto } from '../../interfaces/models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <!-- Hero -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight">Bienvenido a nuestra Tienda</h1>
          <p class="mt-4 text-lg text-blue-100">Encuentra los mejores productos con envío a todo Chile.</p>
          <a routerLink="/productos"
             class="mt-8 inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Ver productos
          </a>
        </div>
      </div>
    </section>

    <!-- Categorías -->
    @if (categorias().length > 0) {
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          @for (cat of categorias(); track cat.id) {
            <button (click)="goToCategory(cat)"
                    class="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-center transition-colors">
              <span class="text-sm font-medium text-gray-800">{{ cat.nombre }}</span>
            </button>
          }
        </div>
      </section>
    }

    <!-- Productos destacados -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Productos destacados</h2>
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      } @else if (productos().length === 0) {
        <p class="text-gray-500 text-center py-12">No hay productos disponibles.</p>
      } @else {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          @for (producto of productos().slice(0, 10); track producto.id) {
            <app-product-card
              [producto]="producto"
              (addToCart)="onAddToCart($event)"
              (cardClick)="goToProduct($event)" />
          }
        </div>
        @if (productos().length > 10) {
          <div class="mt-8 text-center">
            <a routerLink="/productos"
               class="text-blue-600 hover:text-blue-800 font-medium">
              Ver todos los productos →
            </a>
          </div>
        }
      }
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  private productoService = inject(ProductoService);
  private cartService = inject(CartService);
  private router = inject(Router);

  productos = signal<Producto[]>([]);
  categorias = signal<CategoriaProducto[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.productoService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data.filter(c => c.visibleWeb)),
    });
  }

  onAddToCart(producto: Producto): void {
    this.cartService.addItem(producto);
  }

  goToProduct(producto: Producto): void {
    this.router.navigate(['/productos', producto.id]);
  }

  goToCategory(cat: CategoriaProducto): void {
    this.router.navigate(['/productos'], { queryParams: { categoria: cat.id } });
  }
}
