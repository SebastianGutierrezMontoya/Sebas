import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Roles } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RolesService extends BaseService<Roles, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/roles');
  }
}