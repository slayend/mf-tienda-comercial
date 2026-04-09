import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { MetodoPago, ClienteRequest, PedidoWebRequest } from '../../interfaces/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

      @if (cartService.items().length === 0) {
        <div class="text-center py-16">
          <p class="text-gray-500 text-lg">No hay productos en el carrito.</p>
          <button (click)="router.navigate(['/productos'])"
                  class="mt-4 text-blue-600 hover:text-blue-800 font-medium">
            ← Ver productos
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Formulario -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Datos del cliente -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="font-semibold text-gray-900 text-lg mb-4">Datos del cliente</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" [(ngModel)]="cliente.nombre"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="Juan">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input type="text" [(ngModel)]="cliente.apellido"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="Pérez">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">RUT *</label>
                  <input type="text" [(ngModel)]="cliente.rut"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="12.345.678-9">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" [(ngModel)]="cliente.email"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="juan&#64;email.com">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" [(ngModel)]="cliente.telefono"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="+56 9 1234 5678">
                </div>
              </div>
            </div>

            <!-- Dirección de envío -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="font-semibold text-gray-900 text-lg mb-4">Dirección de envío</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input type="text" [(ngModel)]="direccionEnvio"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="Av. Principal 123, Depto 4B">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input type="text" [(ngModel)]="ciudad"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="Santiago">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Región *</label>
                  <input type="text" [(ngModel)]="region"
                         class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="Región Metropolitana">
                </div>
              </div>
            </div>

            <!-- Notas -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="font-semibold text-gray-900 text-lg mb-4">Notas del pedido</h2>
              <textarea [(ngModel)]="notas" rows="3"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Instrucciones especiales para la entrega (opcional)"></textarea>
            </div>

            <!-- Método de pago -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="font-semibold text-gray-900 text-lg mb-4">Método de pago</h2>
              @if (metodosPago().length === 0) {
                <p class="text-gray-500 text-sm">Cargando métodos de pago...</p>
              } @else {
                <div class="space-y-3">
                  @for (mp of metodosPago(); track mp.id) {
                    <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors"
                           [class]="metodoPagoId === mp.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'">
                      <input type="radio" name="metodoPago" [value]="mp.id"
                             [(ngModel)]="metodoPagoId"
                             class="text-blue-600 focus:ring-blue-500">
                      <span class="text-sm font-medium text-gray-800">{{ mp.nombre }}</span>
                    </label>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Resumen lateral -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 class="font-semibold text-gray-900 text-lg mb-4">Resumen</h2>
              <div class="space-y-3 mb-4">
                @for (item of cartService.items(); track item.producto.id) {
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 truncate mr-2">{{ item.producto.nombre }} × {{ item.cantidad }}</span>
                    <span class="text-gray-900 shrink-0">{{ item.producto.precioVenta * item.cantidad | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
                  </div>
                }
              </div>
              <div class="border-t pt-3 space-y-2 text-sm">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
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

              @if (error()) {
                <div class="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-lg">{{ error() }}</div>
              }

              <button (click)="confirmarPedido()"
                      [disabled]="procesando()"
                      class="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors">
                @if (procesando()) {
                  Procesando...
                } @else {
                  Confirmar pedido
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CheckoutPageComponent implements OnInit {
  cartService = inject(CartService);
  router = inject(Router);
  private checkoutService = inject(CheckoutService);

  metodosPago = signal<MetodoPago[]>([]);
  procesando = signal(false);
  error = signal('');

  cliente: ClienteRequest = {
    empresaId: environment.empresaId,
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
  };

  direccionEnvio = '';
  ciudad = '';
  region = '';
  notas = '';
  metodoPagoId = 0;

  ngOnInit(): void {
    this.checkoutService.getMetodosPago().subscribe({
      next: (data) => this.metodosPago.set(data),
    });
  }

  confirmarPedido(): void {
    this.error.set('');

    if (!this.cliente.nombre || !this.cliente.apellido || !this.cliente.rut || !this.cliente.email) {
      this.error.set('Complete todos los campos obligatorios del cliente.');
      return;
    }
    if (!this.direccionEnvio || !this.ciudad || !this.region) {
      this.error.set('Complete la dirección de envío.');
      return;
    }
    if (!this.metodoPagoId) {
      this.error.set('Seleccione un método de pago.');
      return;
    }

    this.procesando.set(true);
    this.cliente.direccion = `${this.direccionEnvio}, ${this.ciudad}, ${this.region}`;

    this.checkoutService.crearCliente(this.cliente, 'web').subscribe({
      next: (clienteResp) => {
        const pedido: PedidoWebRequest = {
          empresaId: environment.empresaId,
          clienteId: clienteResp.id,
          metodoPagoId: this.metodoPagoId,
          estado: 'PENDIENTE',
          notas: this.notas || undefined,
          direccionEnvio: this.cliente.direccion,
          detalles: this.cartService.items().map(item => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precioVenta,
            descuento: 0,
          })),
        };

        this.checkoutService.crearPedido(pedido, 'web').subscribe({
          next: (pedidoResp) => {
            this.cartService.clear();
            this.router.navigate(['/pedido-confirmado'], {
              queryParams: { numero: pedidoResp.numeroPedido },
            });
          },
          error: () => {
            this.error.set('Error al crear el pedido. Intente nuevamente.');
            this.procesando.set(false);
          },
        });
      },
      error: () => {
        this.error.set('Error al registrar los datos del cliente. Intente nuevamente.');
        this.procesando.set(false);
      },
    });
  }
}
