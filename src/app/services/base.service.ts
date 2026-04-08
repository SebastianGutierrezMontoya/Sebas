// base.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T, ID> {

  constructor(
    protected http: HttpClient,
    protected apiUrl: string
  ) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: ID): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(data: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, data);
  }

  update(id: ID, data: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



}