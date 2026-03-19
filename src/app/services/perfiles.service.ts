import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Perfiles } from '../models/models';


@Injectable({ providedIn: 'root' })
export class PerfilesService extends BaseService<Perfiles, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/perfiles');
  }
}