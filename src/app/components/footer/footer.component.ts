import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-gray-300 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-white font-semibold text-lg mb-3">Tienda Web</h3>
            <p class="text-sm">Tu tienda online de confianza. Productos de calidad con envío a todo Chile.</p>
          </div>
          <div>
            <h3 class="text-white font-semibold text-lg mb-3">Enlaces</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="/productos" class="hover:text-white transition-colors">Productos</a></li>
              <li><a href="/seguimiento" class="hover:text-white transition-colors">Seguir mi pedido</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold text-lg mb-3">Contacto</h3>
            <ul class="space-y-2 text-sm">
              <li>contacto&#64;tiendaweb.cl</li>
              <li>+56 9 1234 5678</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {{ currentYear }} Gestor Comercial — Primevial Cloud. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
