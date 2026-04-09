import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CheckoutService } from '../../services/checkout.service';
import { PedidoWebResponse } from '../../interfaces/models';

@Component({
  selector: 'app-seguimiento-page',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Seguimiento de pedido</h1>
      <p class="text-gray-500 mb-8">Ingresa el número de tu pedido para consultar su estado.</p>

      <!-- Formulario de búsqueda -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex gap-3">
          <input type="text" [(ngModel)]="numeroPedido"
                 (keyup.enter)="buscarPedido()"
                 placeholder="Número de pedido (ej: PW-00001)"
                 class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <button (click)="buscarPedido()"
                  [disabled]="buscando()"
                  class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shrink-0">
            @if (buscando()) {
              Buscando...
            } @else {
              Buscar
            }
          </button>
        </div>
      </div>

      @if (error()) {
        <div class="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-6">{{ error() }}</div>
      }

      <!-- Resultado -->
      @if (pedido()) {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- Header -->
          <div class="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Pedido</p>
              <p class="font-bold text-gray-900">{{ pedido()!.numeroPedido }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-semibold rounded-full"
                  [class]="getEstadoClasses(pedido()!.estado)">
              {{ pedido()!.estado }}
            </span>
          </div>

          <!-- Info general -->
          <div class="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm border-b">
            <div>
              <p class="text-gray-500">Fecha</p>
              <p class="font-medium text-gray-900">{{ pedido()!.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <div>
              <p class="text-gray-500">Método de pago</p>
              <p class="font-medium text-gray-900">{{ pedido()!.metodoPagoNombre || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-gray-500">Dirección de envío</p>
              <p class="font-medium text-gray-900">{{ pedido()!.direccionEnvio || 'N/A' }}</p>
            </div>
          </div>

          <!-- Detalles -->
          <div class="px-6 py-4">
            <h3 class="font-semibold text-gray-900 mb-3">Productos</h3>
            <div class="space-y-3">
              @for (detalle of pedido()!.detalles; track detalle.id) {
                <div class="flex justify-between items-center text-sm">
                  <div>
                    <span class="text-gray-900">{{ detalle.productoNombre || 'Producto #' + detalle.productoId }}</span>
                    <span class="text-gray-500 ml-2">× {{ detalle.cantidad }}</span>
                  </div>
                  <span class="font-medium text-gray-900">{{ detalle.precioUnitario * detalle.cantidad | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Total -->
          <div class="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
            <span class="font-semibold text-gray-900">Total</span>
            <span class="text-xl font-bold text-gray-900">{{ pedido()!.total | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
          </div>

          @if (pedido()!.notas) {
            <div class="px-6 py-4 border-t">
              <p class="text-sm text-gray-500">Notas</p>
              <p class="text-sm text-gray-700">{{ pedido()!.notas }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SeguimientoPageComponent {
  private checkoutService = inject(CheckoutService);
  private route = inject(ActivatedRoute);

  numeroPedido = '';
  pedido = signal<PedidoWebResponse | null>(null);
  buscando = signal(false);
  error = signal('');

  constructor() {
    const numero = this.route.snapshot.queryParams['numero'];
    if (numero) {
      this.numeroPedido = numero;
      this.buscarPedido();
    }
  }

  buscarPedido(): void {
    const numero = this.numeroPedido.trim();
    if (!numero) {
      this.error.set('Ingrese un número de pedido.');
      return;
    }

    this.error.set('');
    this.pedido.set(null);
    this.buscando.set(true);

    this.checkoutService.consultarPedido(numero).subscribe({
      next: (data) => {
        this.pedido.set(data);
        this.buscando.set(false);
      },
      error: () => {
        this.error.set('No se encontró un pedido con ese número.');
        this.buscando.set(false);
      },
    });
  }

  getEstadoClasses(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMADO':
      case 'PAGADO': return 'bg-green-100 text-green-800';
      case 'ENVIADO': return 'bg-blue-100 text-blue-800';
      case 'ENTREGADO': return 'bg-gray-100 text-gray-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
