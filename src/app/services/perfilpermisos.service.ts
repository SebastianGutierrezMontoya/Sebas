import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { PerfilPermisos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PerfilPermisosService extends BaseService<PerfilPermisos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/perfil-permisos');
  }
}