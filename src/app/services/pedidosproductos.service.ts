import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { PedidosProductos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PedidosProductosService extends BaseService<PedidosProductos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/pedidos_productos');
  }

  getByPedidoId(ped_id: number) {
    return this.http.get<PedidosProductos[]>(`${this.apiUrl}/pedido/${ped_id}`);
  }

  actualizar(id: number, id2: string, data: PedidosProductos) {
    return this.http.put(`${this.apiUrl}/${id}/${id2}`, data) // Retorna null ya que la respuesta se maneja en el subscribe
  }

  borrar(id: number, id2: string) {
    return this.http.delete(`${this.apiUrl}/${id}/${id2}`) // Retorna null ya que la respuesta se maneja en el subscribe
  }

  getByIds(ids: { ped_id: number, prod_id: string }) {
    return this.http.get<PedidosProductos>(`${this.apiUrl}/${ids.ped_id}/${ids.prod_id}`);
  }


}