import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, CategoriaProducto } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/empresa/${environment.empresaId}`);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/productos/${id}`);
  }

  getCategorias(): Observable<CategoriaProducto[]> {
    return this.http.get<CategoriaProducto[]>(
      `${this.apiUrl}/categorias-productos/empresa/${environment.empresaId}`
    );
  }

  getImagenUrl(id: number): string {
    return `${this.apiUrl}/productos/${id}/imagen`;
  }
}
