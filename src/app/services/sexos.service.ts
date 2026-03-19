import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Sexos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SexosService extends BaseService<Sexos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/sexos');
  }
}