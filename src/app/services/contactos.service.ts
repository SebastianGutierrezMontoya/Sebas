import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Contactos } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContactosService extends BaseService<Contactos, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/api/contactos');
  }
}