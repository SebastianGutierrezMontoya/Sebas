import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Productos } from '../models/models';


@Injectable({ providedIn: 'root' })
export class ProductosService extends BaseService<Productos, string> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/productos');
  }
}