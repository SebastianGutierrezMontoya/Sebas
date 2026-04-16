import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { EstadoPedidos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EstadoPedidosService extends BaseService<EstadoPedidos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/estadopedidos');
  }
}