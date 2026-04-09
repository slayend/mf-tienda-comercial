import { computed, Injectable, signal } from '@angular/core';
import { CartItem, Producto } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'tienda_cart';

  items = signal<CartItem[]>(this.loadFromStorage());

  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.producto.precioVenta * item.cantidad, 0)
  );

  iva = computed(() => Math.round(this.subtotal() * 0.19));

  total = computed(() => this.subtotal() + this.iva());

  addItem(producto: Producto, cantidad: number = 1): void {
    const current = this.items();
    const existing = current.find(i => i.producto.id === producto.id);

    if (existing) {
      this.items.set(
        current.map(i =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        )
      );
    } else {
      this.items.set([...current, { producto, cantidad }]);
    }
    this.saveToStorage();
  }

  removeItem(productoId: number): void {
    this.items.set(this.items().filter(i => i.producto.id !== productoId));
    this.saveToStorage();
  }

  updateQuantity(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.removeItem(productoId);
      return;
    }
    this.items.set(
      this.items().map(i =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      )
    );
    this.saveToStorage();
  }

  clear(): void {
    this.items.set([]);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
    } catch {
      // Storage not available
    }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
