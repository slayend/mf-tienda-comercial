import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConfiguracionWeb } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class ConfiguracionWebService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  config = signal<ConfiguracionWeb | null>(null);

  loadConfig(): void {
    this.http
      .get<ConfiguracionWeb>(`${this.apiUrl}/configuracion-web/empresa/${environment.empresaId}`)
      .subscribe({
        next: (data) => this.config.set(data),
        error: () => this.config.set(null),
      });
  }
}
