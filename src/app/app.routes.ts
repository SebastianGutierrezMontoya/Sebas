import { Routes } from '@angular/router';
import { Users } from './components/users/users';
import { Home } from './components/home/home';
import { LoginComponent } from './components/auth/login';
import { RegistroComponent } from './components/auth/registro';
import { UsuariosComponent } from './components/usuarios/usuarios';
import { UsuariosForm } from './components/usuarios/usuarios-form';
import { Sexos } from './components/sexos/sexos';
import { SexosForm } from './components/sexos/sexos_form';
import { Roles } from './components/roles/roles';
import { RolesForm } from './components/roles/roles_form';
import { Perfiles } from './components/perfiles/perfiles';
import { PerfilesForm } from './components/perfiles/perfiles_form';
import { PerfilesPermisos } from './components/perfiles/perfiles_permisos';
import { ConfigContactos } from './components/config_contactos/config_contactos';
import { ConfigContactosForm } from './components/config_contactos/config_contactos_form';
import { Categorias } from './components/categorias/categorias';
import { CategoriasForm } from './components/categorias/categorias_form';
import { Producto } from './components/productos/productos';
import { ProductosForm } from './components/productos/productos_form';
import { AuditoriaProductos } from './components/productos/auditoria_productos';
import { Pedidoss } from './components/pedidos/pedidoss';
import { PedidosForm } from './components/pedidos/pedidos_form';
import { PedidosProductosForm } from './components/pedidos/pedidos_productos_form';
import { Estados } from './components/estados/estados';
import { EstadosForm } from './components/estados/estados_form';
import { ConsultasDinamicass } from './components/consultas_dinamicas/consultas_dinamicass';
import { ConsultasDinamicasForm } from './components/consultas_dinamicas/consultas_dinamicas_form';
import { ConsultasDinamicasResultado } from './components/consultas_dinamicas/consultas_dinamicas_resultado';

import { permisosGuard } from './guards/permisos.guard';

export const routes: Routes = [
	// Rutas públicas (sin protección)
	{ path: 'login', component: LoginComponent },
	{ path: 'registro', component: RegistroComponent },
	
	// Rutas protegidas
	{ path: '', component: Home },
	{ path: 'users', component: Users},
	{ path: 'usuarios', component: UsuariosComponent, canActivate: [permisosGuard], data: { moduloId: 1, accion: 'read' } },
    { path: 'usuarios/form', component: UsuariosForm, canActivate: [permisosGuard], data: { moduloId: 1, accion: 'create' } },
    { path: 'usuarios/form/:id', component: UsuariosForm, canActivate: [permisosGuard], data: { moduloId: 1, accion: 'update' } },

    { path : 'sexos', component: Sexos, canActivate: [permisosGuard], data: { moduloId: 2, accion: 'read' } },
    { path : 'sexos/form', component: SexosForm, canActivate: [permisosGuard], data: { moduloId: 2, accion: 'create' } },
    { path : 'sexos/form/:id', component: SexosForm, canActivate: [permisosGuard], data: { moduloId: 2, accion: 'update' } },

    { path : 'roles', component: Roles, canActivate: [permisosGuard], data: { moduloId: 3, accion: 'read' } },
    { path : 'roles/form', component: RolesForm, canActivate: [permisosGuard], data: { moduloId: 3, accion: 'create' } },
    { path : 'roles/form/:id', component: RolesForm, canActivate: [permisosGuard], data: { moduloId: 3, accion: 'update' } },

    { path : 'perfiles', component: Perfiles, canActivate: [permisosGuard], data: { moduloId: 4, accion: 'read' } },
    { path : 'perfiles/form', component: PerfilesForm, canActivate: [permisosGuard], data: { moduloId: 4, accion: 'create' } },
    { path : 'perfiles/form/:id', component: PerfilesForm, canActivate: [permisosGuard], data: { moduloId: 4, accion: 'update' } },
    { path : 'perfiles/permisos/:id', component: PerfilesPermisos, canActivate: [permisosGuard], data: { moduloId: 4, accion: 'read' } },

    { path : 'config_contactos', component: ConfigContactos, canActivate: [permisosGuard], data: { moduloId: 6, accion: 'read' } },
    { path : 'config_contactos/form', component: ConfigContactosForm, canActivate: [permisosGuard], data: { moduloId: 6, accion: 'create' } },
    { path : 'config_contactos/form/:id', component: ConfigContactosForm, canActivate: [permisosGuard], data: { moduloId: 6, accion: 'update' } },

    { path : 'categorias', component: Categorias, canActivate: [permisosGuard], data: { moduloId: 7, accion: 'read' } },
    { path : 'categorias/form', component: CategoriasForm, canActivate: [permisosGuard], data: { moduloId: 7, accion: 'create' } },
    { path : 'categorias/form/:id', component: CategoriasForm, canActivate: [permisosGuard], data: { moduloId: 7, accion: 'update' } },

    { path : 'productos', component: Producto, canActivate: [permisosGuard], data: { moduloId: 8, accion: 'read' } },
    { path : 'productos/form', component: ProductosForm, canActivate: [permisosGuard], data: { moduloId: 8, accion: 'create' } },
    { path : 'productos/form/:id', component: ProductosForm, canActivate: [permisosGuard], data: { moduloId: 8, accion: 'update' } },
    { path : 'productos/auditoria', component: AuditoriaProductos, canActivate: [permisosGuard], data: { moduloId: 8, accion: 'read' } },
    { path : 'pedidos_productos/form/:pedidoId/:productoId', component: PedidosProductosForm, canActivate: [permisosGuard], data: { moduloId: 8, accion: 'read' } },

    { path : 'pedidos', component: Pedidoss, canActivate: [permisosGuard], data: { moduloId: 9, accion: 'read' } },
    { path : 'pedidos/form', component: PedidosForm, canActivate: [permisosGuard], data: { moduloId: 9, accion: 'create' } },
    { path : 'pedidos/form/:id', component: PedidosForm, canActivate: [permisosGuard], data: { moduloId: 9, accion: 'update' } },

    { path : 'estado_pedidos', component: Estados, canActivate: [permisosGuard], data: { moduloId: 10, accion: 'read' } },
    { path : 'estado_pedidos/form', component: EstadosForm, canActivate: [permisosGuard], data: { moduloId: 10, accion: 'create' } },
    { path : 'estado_pedidos/form/:id', component: EstadosForm, canActivate: [permisosGuard], data: { moduloId: 10, accion: 'update' } },

    { path : 'consultas_dinamicas', component: ConsultasDinamicass, canActivate: [permisosGuard], data: { moduloId: 11, accion: 'read' } },
    { path : 'consultas_dinamicas/form', component: ConsultasDinamicasForm, canActivate: [permisosGuard], data: { moduloId: 11, accion: 'create' } },
    { path : 'consultas_dinamicas/form/:id', component: ConsultasDinamicasForm, canActivate: [permisosGuard], data: { moduloId: 11, accion: 'update' } },
    { path : 'consultas_dinamicas/resultados', component: ConsultasDinamicasResultado, canActivate: [permisosGuard], data: { moduloId: 11, accion: 'read' } },
    { path : 'consultas_dinamicas/resultados/:id', component: ConsultasDinamicasResultado, canActivate: [permisosGuard], data: { moduloId: 11, accion: 'read' } },
];
 