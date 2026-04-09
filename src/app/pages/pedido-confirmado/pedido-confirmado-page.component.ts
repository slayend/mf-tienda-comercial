import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pedido-confirmado-page',
  standalone: true,
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
        <p class="text-gray-600 mb-6">Tu pedido ha sido registrado exitosamente.</p>

        @if (numeroPedido) {
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-sm text-gray-500">Número de pedido</p>
            <p class="text-xl font-bold text-gray-900">{{ numeroPedido }}</p>
          </div>
          <p class="text-sm text-gray-500 mb-6">
            Guarda este número para hacer seguimiento de tu pedido.
          </p>
        }

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button (click)="router.navigate(['/seguimiento'], { queryParams: { numero: numeroPedido } })"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            Ver estado del pedido
          </button>
          <button (click)="router.navigate(['/'])"
                  class="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-colors">
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PedidoConfirmadoPageComponent {
  router = inject(Router);
  private route = inject(ActivatedRoute);
  numeroPedido = this.route.snapshot.queryParams['numero'] || '';
}
