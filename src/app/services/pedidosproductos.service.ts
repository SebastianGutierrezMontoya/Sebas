import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { PedidosProductos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PedidosProductosService extends BaseService<PedidosProductos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/pedidos-productos');
  }

  getByPedidoId(ped_id: number) {
    return this.http.get<PedidosProductos[]>(`${this.apiUrl}/pedido/${ped_id}`);
  }
}