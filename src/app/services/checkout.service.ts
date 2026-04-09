import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  PedidoWebRequest,
  PedidoWebResponse,
  MetodoPago,
  ClienteRequest,
  ClienteResponse,
} from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(
      `${this.apiUrl}/metodos-pago/empresa/${environment.empresaId}`
    );
  }

  crearCliente(request: ClienteRequest, username: string): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(
      `${this.apiUrl}/clientes?username=${encodeURIComponent(username)}`,
      request
    );
  }

  crearPedido(request: PedidoWebRequest, username: string): Observable<PedidoWebResponse> {
    return this.http.post<PedidoWebResponse>(
      `${this.apiUrl}/pedidos-web?username=${encodeURIComponent(username)}`,
      request
    );
  }

  consultarPedido(numeroPedido: string): Observable<PedidoWebResponse> {
    return this.http.get<PedidoWebResponse>(
      `${this.apiUrl}/pedidos-web/numero/${encodeURIComponent(numeroPedido)}`
    );
  }
}
