import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Productos } from '../models/models';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({ providedIn: 'root' })
export class ProductosService extends BaseService<Productos, string> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/productos');
  }
  // productos.service.ts
getProductos(search?: string, page: number = 1) {
  return this.http.get<Productos[]>(this.apiUrl, {
    params: {
      search: search || '',
      page,
      limit: 10
    }
  });
}
  
  
}

