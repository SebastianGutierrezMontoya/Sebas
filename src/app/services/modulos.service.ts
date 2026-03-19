import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Modulos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ModulosService extends BaseService<Modulos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/modulos');
  }
}