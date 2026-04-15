import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ProductosAuditoria } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductosAuditoriaService extends BaseService<ProductosAuditoria, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/productos-auditoria');
  }

  getAuditoria() {
        // return this.http.get<ProductosAuditoria[]>('http://localhost:3000/api/productos-auditoria');
        return this.http.get<ProductosAuditoria[]>('http://localhost:3000/api/productos-auditoria');
    
  }
}