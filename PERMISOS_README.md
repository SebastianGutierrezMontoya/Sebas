# Sistema de Control de Permisos

Este proyecto incluye un sistema completo de control de permisos basado en la tabla `perfilpermisos` de la base de datos.

## 📋 Componentes del Sistema

### Servicios
- **AuthService** (`src/app/services/auth.service.ts`): Maneja autenticación y almacena permisos
- **PermisosService** (`src/app/services/permisos.service.ts`): Servicio central de verificación de permisos

### Guardias de Ruta
- **permisosGuard** (`src/app/guards/permisos.guard.ts`): Protege rutas basándose en permisos

### Directivas
- **TienePermisoDirective** (`src/app/directives/tiene-permiso.directive.ts`): Mostrar/ocultar elementos
- **DeshabilitarSinPermisoDirective** (`src/app/directives/deshabilitar-sin-permiso.directive.ts`): Deshabilitar elementos

## 🔑 Cómo Funciona

### 1. Login y Carga de Permisos
Cuando un usuario hace login:
1. Backend valida credenciales
2. Backend obtiene permisos del perfil del usuario
3. Frontend almacena token, usuario y permisos en localStorage
4. PermisosService se actualiza automáticamente

### 2. Verificación de Permisos
Tres formas de verificar permisos:

#### A. En Componentes (Programativamente)
```typescript
import { PermisosService } from './services/permisos.service';

export class MiComponente {
  constructor(private permisosService: PermisosService) {}

  ngOnInit() {
    if (this.permisosService.puedeLeer(1)) {
      // Cargar datos
    }
  }
}
```

#### B. En Templates (Directivas)
```html
<!-- Mostrar solo si tiene permiso -->
<button *appTienePermiso="{ moduloId: 1, accion: 'create' }">
  Crear
</button>

<!-- Deshabilitar si no tiene permiso -->
<button [appDeshabilitarSinPermiso]="{ moduloId: 1, accion: 'delete' }">
  Eliminar
</button>
```

#### C. En Rutas (Guardias)
```typescript
export const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [permisosGuard],
    data: { moduloId: 1, accion: 'read' }
  }
];
```

## 📦 IDs de Módulos Comunes

Estos son los IDs típicos (verifica en tu tabla `modulos`):

- 1: Usuarios
- 2: Sexos
- 3: Roles
- 4: Perfiles
- 5: Contactos
- 6: Config_Contactos
- 7: Categorias
- 8: Productos
- 9: Pedidos
- 10: Estados
- 11: Consultas Dinámicas

## ✅ Acciones de Permisos

Cada módulo puede tener 4 tipos de permisos:
- `read`: Ver/Leer datos
- `create`: Crear nuevos registros
- `update`: Editar registros
- `delete`: Eliminar registros

## 🚀 Cómo Usar en tus Componentes

### Paso 1: Importa las directivas y servicios
```typescript
import { CommonModule } from '@angular/common';
import { TienePermisoDirective } from '../directives/tiene-permiso.directive';
import { DeshabilitarSinPermisoDirective } from '../directives/deshabilitar-sin-permiso.directive';
import { PermisosService } from '../services/permisos.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    TienePermisoDirective,
    DeshabilitarSinPermisoDirective
  ]
})
export class UsuariosComponent {
  // ...
}
```

### Paso 2: Usa en el template
```html
<div class="usuarios-container">
  <h1>Gestión de Usuarios</h1>

  <!-- Botón crear solo visible si tiene permiso -->
  <button *appTienePermiso="{ moduloId: 1, accion: 'create' }"
          class="btn btn-primary"
          (click)="irAFormulario()">
    + Crear Usuario
  </button>

  <!-- Tabla -->
  <table class="table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let usuario of usuarios">
        <td>{{ usuario.nombre }}</td>
        <td>{{ usuario.email }}</td>
        <td>
          <button *appTienePermiso="{ moduloId: 1, accion: 'read' }"
                  class="btn btn-sm btn-info">
            Ver
          </button>
          <button [appDeshabilitarSinPermiso]="{ moduloId: 1, accion: 'update' }"
                  class="btn btn-sm btn-warning"
                  (click)="editar(usuario)">
            Editar
          </button>
          <button [appDeshabilitarSinPermiso]="{ moduloId: 1, accion: 'delete' }"
                  class="btn btn-sm btn-danger"
                  (click)="eliminar(usuario)">
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Paso 3: Lógica del componente
```typescript
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  private MODULO_ID = 1; // ID para el módulo Usuarios

  constructor(private permisosService: PermisosService) {}

  ngOnInit() {
    // Verificar permiso de lectura
    if (this.permisosService.puedeLeer(this.MODULO_ID)) {
      this.cargarUsuarios();
    }
  }

  private cargarUsuarios() {
    // Lógica de carga
  }

  irAFormulario() {
    // Verificar permiso de creación
    if (!this.permisosService.puedeCrear(this.MODULO_ID)) {
      alert('No tienes permiso para crear');
      return;
    }
    // Navegar a formulario
  }

  editar(usuario: any) {
    if (!this.permisosService.puedeActualizar(this.MODULO_ID)) {
      alert('No tienes permiso para editar');
      return;
    }
    // Lógica de edición
  }

  eliminar(usuario: any) {
    if (!this.permisosService.puedeEliminar(this.MODULO_ID)) {
      alert('No tienes permiso para eliminar');
      return;
    }
    // Lógica de eliminación
  }
}
```

## 🔐 Proteger Rutas

En `app.routes.ts`:

```typescript
import { permisosGuard } from './guards/permisos.guard';

export const routes: Routes = [
  // Rutas sin protección
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Rutas con protección de permisos
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [permisosGuard],
    data: { moduloId: 1, accion: 'read' } // Requiere permiso de lectura
  },
  {
    path: 'usuarios/form',
    component: UsuariosFormComponent,
    canActivate: [permisosGuard],
    data: { moduloId: 1, accion: 'create' } // Requiere permiso de creación
  },
  {
    path: 'usuarios/form/:id',
    component: UsuariosFormComponent,
    canActivate: [permisosGuard],
    data: { moduloId: 1, accion: 'update' } // Requiere permiso de actualización
  }
];
```

## 🔄 Sincronización con Backend

### Login
El backend devuelve permisos automáticamente en `/api/auth/login`

### Recargar Permisos
Si los permisos cambian (ej: después de editar permisos):

```typescript
// En el componente
this.permisosService.recargarPermisos().subscribe(nuevoPermisos => {
  console.log('Permisos actualizados:', nuevoPermisos);
  // Actualizar UI
});
```

## 📊 Métodos Disponibles del PermisosService

```typescript
// Verificación específica
tienePermiso(moduloId: number, accion: 'read' | 'create' | 'update' | 'delete'): boolean

// Métodos cortos
puedeLeer(moduloId: number): boolean
puedeCrear(moduloId: number): boolean
puedeActualizar(moduloId: number): boolean
puedeEliminar(moduloId: number): boolean

// Obtener datos
getPermisosActuales(): PermisoModulo[]

// Recargar desde servidor
recargarPermisos(): Observable<PermisoModulo[]>

// Observable para suscribirse
permisos$: Observable<PermisoModulo[]>
```

## ⚠️ Notas Importantes

1. **Frontend no es seguro**: Este sistema solo controla la UI. La seguridad real debe estar en el backend.
2. **Validar en backend**: Siempre valida permisos en el servidor antes de realizar operaciones.
3. **IDs de módulos**: Obtén los IDs correctos consultando tu tabla `modulos`.
4. **localStorage**: Los permisos se guardan en localStorage. Se limpian automáticamente en logout.

## 🐛 Debugging

Para ver qué permisos tiene el usuario actual:

```typescript
// En la consola del navegador
localStorage.getItem('permisos') // Ver permisos en JSON

// En componente
console.log(this.permisosService.getPermisosActuales());
```

## 📝 Estructura de Datos

### Tabla `perfilpermisos`
```
perfil_id    | mod_id | can_read | can_create | can_update | can_delete
1            | 1      | Y        | Y          | Y          | N
1            | 2      | Y        | N          | N          | N
```

### Token JWT (localStorage)
- `token`: JWT token
- `usuario`: Datos del usuario (id, nombre, perfil)
- `permisos`: Array de permisos del perfil

¡Sistema de permisos completamente funcional! 🎉
