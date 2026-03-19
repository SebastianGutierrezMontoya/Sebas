import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ConfigContacto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ConfigContactoService extends BaseService<ConfigContacto, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/config-contacto');
  }
}