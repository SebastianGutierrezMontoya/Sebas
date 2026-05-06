import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { PerfilPermisos } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerfilPermisosService extends BaseService<PerfilPermisos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/perfil-permisos');
  }

  // Obtener permisos de un perfil específico
  getByPerfilId(perfilId: number): Observable<PerfilPermisos[]> {
    return this.http.get<PerfilPermisos[]>(`${this.apiUrl}/perfil/${perfilId}`);
  }

  // Guardar múltiples permisos (upsert)
  guardarPermisos(perfilId: number, permisos: PerfilPermisos[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar-permisos`, {
      perfil_id: perfilId,
      permisos: permisos
    });
  }
}