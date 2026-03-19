// categoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Categoria } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategoriaService extends BaseService<Categoria, string> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/categorias');
  }
}