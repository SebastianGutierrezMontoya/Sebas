import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  id_usuario: string;
  password: string;
}

export interface RegistroRequest {
  id_usuario: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido?: string;
  fecha_nacimiento?: string;
  password: string;
  usuario_id_sexo: number;
}

export interface AuthResponse {
  token: string;
  usuario: any;
  permisos?: any[];
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; 
  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromStorage());
  public token$ = this.tokenSubject.asObservable();
  
  private usuarioSubject = new BehaviorSubject<any>(this.getUsuarioFromStorage());
  public usuario$ = this.usuarioSubject.asObservable();

  private permisosSubject = new BehaviorSubject<any[]>(this.getPermisosFromStorage());
  public permisos$ = this.permisosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener token del almacenamiento local
  private getTokenFromStorage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Obtener usuario del almacenamiento local
  private getUsuarioFromStorage(): any {
    if (typeof window !== 'undefined') {
      const usuario = localStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  // Obtener permisos del almacenamiento local
  private getPermisosFromStorage(): any[] {
    if (typeof window !== 'undefined') {
      const permisos = localStorage.getItem('permisos');
      return permisos ? JSON.parse(permisos) : [];
    }
    return [];
  }

  // Login
  login(credenciales: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            if (response.permisos) {
              localStorage.setItem('permisos', JSON.stringify(response.permisos));
              this.permisosSubject.next(response.permisos);
            }
            this.tokenSubject.next(response.token);
            this.usuarioSubject.next(response.usuario);
          }
        })
      );
  }

  // Registro
  registro(datos: RegistroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, datos)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            if (response.permisos) {
              localStorage.setItem('permisos', JSON.stringify(response.permisos));
              this.permisosSubject.next(response.permisos);
            }
            this.tokenSubject.next(response.token);
            this.usuarioSubject.next(response.usuario);
          }
        })
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('permisos');
    this.tokenSubject.next(null);
    this.usuarioSubject.next(null);
    this.permisosSubject.next([]);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  // Obtener token actual
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // Obtener usuario actual
  getUsuario(): any {
    return this.usuarioSubject.value;
  }

  // Obtener permisos actuales
  getPermisos(): any[] {
    return this.permisosSubject.value;
  }
}
