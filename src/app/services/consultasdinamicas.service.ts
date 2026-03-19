import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ConsultasDinamicas } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ConsultasDinamicasService extends BaseService<ConsultasDinamicas, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/consultas');
  }
}