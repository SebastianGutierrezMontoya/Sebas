import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface PermisoModulo {
  perfil_id: number;
  mod_id: number;
  can_read: string; // 'Y' | 'N'
  can_create: string;
  can_update: string;
  can_delete: string;
}

@Injectable({ providedIn: 'root' })
export class PermisosService {

  private permisosSubject: BehaviorSubject<PermisoModulo[]>;
  public permisos$: Observable<PermisoModulo[]>;

 constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.permisosSubject = new BehaviorSubject<PermisoModulo[]>(this.authService.getPermisos());

    // Actualizar permisos cuando el usuario cambia
    this.authService.permisos$.subscribe(permisos => {
      this.permisosSubject.next(permisos);
    });
    this.permisos$ = this.permisosSubject.asObservable();
  }

  private apiUrl = 'http://localhost:3000/api/perfil-permisos';
  
  

 

  // Obtener permisos de un perfil (para casos específicos)
  getPermisosByPerfil(perfilId: number): Observable<PermisoModulo[]> {
    return this.http.get<PermisoModulo[]>(`${this.apiUrl}/perfil/${perfilId}`);
  }

  // Obtener permisos actuales en memoria
  getPermisosActuales(): PermisoModulo[] {
    return this.permisosSubject.value;
  }

  // Verificar si tiene permiso para una acción en un módulo
  tienePermiso(moduloId: number, accion: 'read' | 'create' | 'update' | 'delete'): boolean {
    const permisos = this.permisosSubject.value;
    const permiso = permisos.find(p => p.mod_id === moduloId);

    if (!permiso) {
      return false;
    }

    const campo = `can_${accion}`;
    return permiso[campo as keyof PermisoModulo] === 'Y';
  }

  // Verificar si tiene permiso de lectura
  puedeLeer(moduloId: number): boolean {
    return this.tienePermiso(moduloId, 'read');
  }

  // Verificar si puede crear
  puedeCrear(moduloId: number): boolean {
    return this.tienePermiso(moduloId, 'create');
  }

  // Verificar si puede actualizar
  puedeActualizar(moduloId: number): boolean {
    return this.tienePermiso(moduloId, 'update');
  }

  // Verificar si puede eliminar
  puedeEliminar(moduloId: number): boolean {
    return this.tienePermiso(moduloId, 'delete');
  }

  // Recargar permisos desde el servidor
  recargarPermisos(): Observable<PermisoModulo[]> {
    const usuario = this.authService.getUsuario();
    if (usuario && usuario.usuario_id_perfil) {
      return this.getPermisosByPerfil(usuario.usuario_id_perfil);
    }
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }
}
