import { Routes } from '@angular/router';
import { Users } from './components/users/users';
import { Home } from './components/home/home';
import { Usuarios } from './components/usuarios/usuarios';
import { UsuariosForm } from './components/usuarios/usuarios-form';
import { Sexos } from './components/sexos/sexos';
import { SexosForm } from './components/sexos/sexos_form';
import { Roles } from './components/roles/roles';
import { RolesForm } from './components/roles/roles_form';
import { ConfigContactos } from './components/config_contactos/config_contactos';
import { ConfigContactosForm } from './components/config_contactos/config_contactos_form';
import { Categorias } from './components/categorias/categorias';
import { CategoriasForm } from './components/categorias/categorias_form';
import { Productos } from './components/productos/productos';
import { ProductosForm } from './components/productos/productos_form';
import { AuditoriaProductos } from './components/productos/auditoria_productos';
import { Pedidos } from './components/pedidos/pedidos';
import { PedidosForm } from './components/pedidos/pedidos_form';
import { Estados } from './components/estados/estados';
import { EstadosForm } from './components/estados/estados_form';
import { ConsultasDinamicas  } from './components/consultas_dinamicas/consultas_dinamicas';
import { ConsultasDinamicasForm } from './components/consultas_dinamicas/consultas_dinamicas_form';


export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'users', component: Users },
	{ path: 'usuarios', component: Usuarios },
    { path: 'usuarios/form', component: UsuariosForm },

    { path : 'sexos', component: Sexos },
    { path : 'sexos/form', component: SexosForm },

    { path : 'roles', component: Roles },
    { path : 'roles/form', component: RolesForm },

    { path : 'config_contactos', component: ConfigContactos },
    { path : 'config_contactos/form', component: ConfigContactosForm },

    { path : 'categorias', component: Categorias },
    { path : 'categorias/form', component: CategoriasForm },
    { path : 'categorias/form/:id', component: CategoriasForm },

    { path : 'productos', component: Productos },
    { path : 'productos/form', component: ProductosForm },
    { path : 'productos/auditoria', component: AuditoriaProductos },

    { path : 'pedidos', component: Pedidos },
    { path : 'pedidos/form', component: PedidosForm },

    { path : 'estado_pedidos', component: Estados },
    { path : 'estado_pedidos/form', component: EstadosForm },

    { path : 'consultas_dinamicas', component: ConsultasDinamicas },
    { path : 'consultas_dinamicas/form', component: ConsultasDinamicasForm },
];
