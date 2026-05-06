import { Routes } from '@angular/router';
import { Users } from './components/users/users';
import { Home } from './components/home/home';
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


export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'users', component: Users },
	{ path: 'usuarios', component: UsuariosComponent },
    { path: 'usuarios/form', component: UsuariosForm },
    { path: 'usuarios/form/:id', component: UsuariosForm },

    { path : 'sexos', component: Sexos },
    { path : 'sexos/form', component: SexosForm },
    { path : 'sexos/form/:id', component: SexosForm },

    { path : 'roles', component: Roles },
    { path : 'roles/form', component: RolesForm },
    { path : 'roles/form/:id', component: RolesForm },

    { path : 'perfiles', component: Perfiles },
    { path : 'perfiles/form', component: PerfilesForm },
    { path : 'perfiles/form/:id', component: PerfilesForm },
    { path : 'perfiles/permisos/:id', component: PerfilesPermisos },

    { path : 'config_contactos', component: ConfigContactos },
    { path : 'config_contactos/form', component: ConfigContactosForm },
    { path : 'config_contactos/form/:id', component: ConfigContactosForm },

    { path : 'categorias', component: Categorias },
    { path : 'categorias/form', component: CategoriasForm },
    { path : 'categorias/form/:id', component: CategoriasForm },

    { path : 'productos', component: Producto },
    { path : 'productos/form', component: ProductosForm },
    { path : 'productos/form/:id', component: ProductosForm },
    { path : 'productos/auditoria', component: AuditoriaProductos },
    { path : 'pedidos_productos/form/:pedidoId/:productoId', component: PedidosProductosForm },

    { path : 'pedidos', component: Pedidoss },
    { path : 'pedidos/form', component: PedidosForm },
    { path : 'pedidos/form/:id', component: PedidosForm },

    { path : 'estado_pedidos', component: Estados },
    { path : 'estado_pedidos/form', component: EstadosForm },
    { path : 'estado_pedidos/form/:id', component: EstadosForm },

    { path : 'consultas_dinamicas', component: ConsultasDinamicass },
    { path : 'consultas_dinamicas/form', component: ConsultasDinamicasForm },
    { path : 'consultas_dinamicas/form/:id', component: ConsultasDinamicasForm },
];
 