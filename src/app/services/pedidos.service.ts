import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Pedidos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PedidosService extends BaseService<Pedidos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/pedidos');
  }
}