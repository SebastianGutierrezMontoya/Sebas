/**
 * EJEMPLOS DE USO DEL SISTEMA DE PERMISOS
 * 
 * El sistema de permisos se basa en:
 * - Módulos (en tabla modulos): cada módulo tiene un id_mod
 * - Permisos (en tabla perfilpermisos): can_read, can_create, can_update, can_delete
 * - Perfiles (en tabla perfiles): cada usuario tiene un perfil
 * 
 * Los módulos comunes son:
 * 1: Usuarios
 * 2: Sexos
 * 3: Roles
 * 4: Perfiles
 * 5: Contactos
 * 6: Config_Contactos
 * 7: Categorias
 * 8: Productos
 * 9: Pedidos
 * 10: Estados
 * 11: Consultas
 * (obtén los IDs reales consultando la tabla modulos)
 */

// ============================================
// 1. EN COMPONENTES - Usar el servicio
// ============================================

import { Component, OnInit } from '@angular/core';
import { PermisosService } from './services/permisos.service';

@Component({
  selector: 'app-usuarios',
  template: `
    <div>
      <h1>Usuarios</h1>
      
      <!-- Mostrar botón solo si tiene permiso -->
      <button *ngIf="puedeCrear" (click)="crearUsuario()">
        Crear Usuario
      </button>
      
      <!-- Tabla de usuarios -->
      <table>
        <tr *ngFor="let usuario of usuarios">
          <td>{{ usuario.nombre }}</td>
          <td>
            <button *ngIf="puedeActualizar" (click)="editar(usuario)">Editar</button>
            <button *ngIf="puedeEliminar" (click)="eliminar(usuario)">Eliminar</button>
          </td>
        </tr>
      </table>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  
  // Propiedades de permisos
  puedeCrear = false;
  puedeActualizar = false;
  puedeEliminar = false;
  puedeLeer = false;

  // ID del módulo "Usuarios" (obtén el valor real de tu BD)
  private MODULO_ID = 1;

  constructor(private permisosService: PermisosService) {}

  ngOnInit(): void {
    // Cargar permisos
    this.actualizarPermisos();
    
    // Suscribirse a cambios de permisos
    this.permisosService.permisos$.subscribe(() => {
      this.actualizarPermisos();
    });

    // Cargar usuarios si tiene permiso
    if (this.puedeLeer) {
      this.cargarUsuarios();
    }
  }

  private actualizarPermisos(): void {
    this.puedeLeer = this.permisosService.puedeLeer(this.MODULO_ID);
    this.puedeCrear = this.permisosService.puedeCrear(this.MODULO_ID);
    this.puedeActualizar = this.permisosService.puedeActualizar(this.MODULO_ID);
    this.puedeEliminar = this.permisosService.puedeEliminar(this.MODULO_ID);
  }

  private cargarUsuarios(): void {
    // Lógica para cargar usuarios
  }

  crearUsuario(): void {
    if (!this.puedeCrear) {
      alert('No tienes permiso para crear usuarios');
      return;
    }
    // Lógica de creación
  }

  editar(usuario: any): void {
    if (!this.puedeActualizar) {
      alert('No tienes permiso para editar usuarios');
      return;
    }
    // Lógica de edición
  }

  eliminar(usuario: any): void {
    if (!this.puedeEliminar) {
      alert('No tienes permiso para eliminar usuarios');
      return;
    }
    // Lógica de eliminación
  }
}

// ============================================
// 2. EN TEMPLATES - Usar directivas
// ============================================

/*
<!-- DIRECTIVA 1: *appTienePermiso - Mostrar/Ocultar elementos -->
<button *appTienePermiso="{ moduloId: 1, accion: 'create' }">
  Crear Usuario
</button>

<!-- Solo muestra el botón si tiene permiso para crear en el módulo 1 -->

<!-- DIRECTIVA 2: [appDeshabilitarSinPermiso] - Deshabilitar elementos -->
<button [appDeshabilitarSinPermiso]="{ moduloId: 1, accion: 'delete' }">
  Eliminar Usuario
</button>

<!-- El botón se deshabilita si no tiene permiso para eliminar en el módulo 1 -->

<!-- Ejemplo completo en tabla -->
<table>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let usuario of usuarios">
      <td>{{ usuario.nombre }}</td>
      <td>
        <button *appTienePermiso="{ moduloId: 1, accion: 'read' }">
          Ver
        </button>
        <button *appTienePermiso="{ moduloId: 1, accion: 'update' }"
                (click)="editar(usuario)">
          Editar
        </button>
        <button [appDeshabilitarSinPermiso]="{ moduloId: 1, accion: 'delete' }"
                (click)="eliminar(usuario)">
          Eliminar
        </button>
      </td>
    </tr>
  </tbody>
</table>
*/

// ============================================
// 3. EN RUTAS - Usar guardias de permiso
// ============================================

/*
// En app.routes.ts, agregar la guardia y datos:

import { permisosGuard } from './guards/permisos.guard';

export const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [permisosGuard],
    data: { moduloId: 1, accion: 'read' }
  },
  {
    path: 'usuarios/form',
    component: UsuariosFormComponent,
    canActivate: [permisosGuard],
    data: { moduloId: 1, accion: 'create' }
  },
  {
    path: 'usuarios/form/:id',
    component: UsuariosFormComponent,
    canActivate: [permisosGuard],
    data: { moduloId: 1, accion: 'update' }
  }
];

// Valores de acción posibles: 'read', 'create', 'update', 'delete'
*/

// ============================================
// 4. VERIFICACIONES PROGRAMÁTICAS
// ============================================

/*
// En componentes, verificar permisos directamente:

import { PermisosService } from './services/permisos.service';

export class MiComponente {
  constructor(private permisosService: PermisosService) {}

  hacerAlgo() {
    // Verificar permiso específico
    if (this.permisosService.tienePermiso(1, 'create')) {
      // Hacer algo si tiene permiso
    }

    // Métodos cortos
    if (this.permisosService.puedeCrear(1)) {
      // Crear
    }
    
    if (this.permisosService.puedeActualizar(1)) {
      // Actualizar
    }
    
    if (this.permisosService.puedeEliminar(1)) {
      // Eliminar
    }
    
    if (this.permisosService.puedeLeer(1)) {
      // Leer
    }

    // Obtener todos los permisos actuales
    const permisos = this.permisosService.getPermisosActuales();
    console.log(permisos);
  }
}
*/

// ============================================
// 5. FLUJO DE AUTENTICACIÓN Y PERMISOS
// ============================================

/*
1. Usuario hace login:
   - Backend valida credenciales
   - Backend obtiene perfil del usuario
   - Backend obtiene permisos del perfil
   - Backend devuelve token + usuario + permisos

2. Frontend recibe respuesta:
   - AuthService guarda token en localStorage
   - AuthService guarda usuario en localStorage
   - AuthService guarda permisos en localStorage
   - AuthService emite evento con permisos

3. PermisosService se actualiza:
   - Recibe cambio en permisos desde AuthService
   - Emite evento con permisos nuevos

4. Componentes se actualizan:
   - Se suscriben a permisos$
   - Actualizan su estado cuando cambien los permisos
   - Muestran/ocultan botones según permisos

5. Protección de rutas:
   - GuardiaPermisos verifica permisos antes de navegar
   - Si no tiene permiso, redirige a home
*/

// ============================================
// 6. IMPORTAR DIRECTIVAS EN COMPONENTES
// ============================================

/*
// En los componentes donde uses las directivas, importa:

import { CommonModule } from '@angular/common';
import { TienePermisoDirective } from '../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../directives/deshabilitar-sin-permiso.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TienePermisoDirective,
    DeshabilitarSinPermisoDirective,
    // ... otros imports
  ]
})
export class MiComponente {
  // ...
}
*/
