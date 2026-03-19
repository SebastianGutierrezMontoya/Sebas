import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Usuarios } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsuariosService extends BaseService<Usuarios, string> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/usuarios');
    }
}