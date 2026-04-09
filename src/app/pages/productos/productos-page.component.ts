import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart.service';
import { Producto, CategoriaProducto } from '../../interfaces/models';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Productos</h1>
      <p class="text-gray-500 mb-8">{{ productosFiltrados().length }} productos encontrados</p>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filtros lateral -->
        <aside class="w-full lg:w-64 shrink-0">
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h3 class="font-semibold text-gray-800 mb-3">Categorías</h3>
            <ul class="space-y-2">
              <li>
                <button (click)="filtrarCategoria(null)"
                        [class]="categoriaSeleccionada() === null ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'"
                        class="text-sm transition-colors">
                  Todas
                </button>
              </li>
              @for (cat of categorias(); track cat.id) {
                <li>
                  <button (click)="filtrarCategoria(cat.id)"
                          [class]="categoriaSeleccionada() === cat.id ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'"
                          class="text-sm transition-colors">
                    {{ cat.nombre }}
                  </button>
                </li>
              }
            </ul>
          </div>

          <!-- Búsqueda -->
          <div class="bg-white rounded-xl shadow-sm p-4 mt-4">
            <h3 class="font-semibold text-gray-800 mb-3">Buscar</h3>
            <input type="text"
                   [value]="busqueda()"
                   (input)="onBusqueda($event)"
                   placeholder="Nombre del producto..."
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </aside>

        <!-- Grid productos -->
        <div class="flex-1">
          @if (loading()) {
            <div class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          } @else if (productosFiltrados().length === 0) {
            <p class="text-gray-500 text-center py-12">No se encontraron productos.</p>
          } @else {
            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (producto of productosFiltrados(); track producto.id) {
                <app-product-card
                  [producto]="producto"
                  (addToCart)="onAddToCart($event)"
                  (cardClick)="goToProduct($event)" />
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProductosPageComponent implements OnInit {
  private productoService = inject(ProductoService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productos = signal<Producto[]>([]);
  categorias = signal<CategoriaProducto[]>([]);
  categoriaSeleccionada = signal<number | null>(null);
  busqueda = signal('');
  loading = signal(true);

  productosFiltrados = computed(() => {
    let resultado = this.productos();
    const catId = this.categoriaSeleccionada();
    const term = this.busqueda().toLowerCase().trim();

    if (catId !== null) {
      resultado = resultado.filter(p => p.categoriaId === catId);
    }
    if (term) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }
    return resultado;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.categoriaSeleccionada.set(+params['categoria']);
      }
    });

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

  filtrarCategoria(id: number | null): void {
    this.categoriaSeleccionada.set(id);
  }

  onBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  onAddToCart(producto: Producto): void {
    this.cartService.addItem(producto);
  }

  goToProduct(producto: Producto): void {
    this.router.navigate(['/productos', producto.id]);
  }
}
