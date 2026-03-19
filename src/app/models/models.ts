// Interfaces TypeScript basadas en los modelos de Django
// Equivalentes a los modelos de Django para usar en Angular

export interface ConsultasDinamicas {
  cons_id: number;
  cons_nombre: string;
  cons_sql: string;
  cons_descripcion?: string;
}

export interface Categoria {
  cat_id: string;
  cat_nombre: string;
  cat_descripcion?: string;
}

export interface EstadoPedidos {
  est_id: number;
  est_nombre: string;
}

export interface Pedidos {
  ped_id: number;
  usu_id: string; // FK a Usuarios.id_usuario
  ped_fecha_pedido?: string; // Date
  ped_total?: number; // Decimal
  ped_estado?: number; // Float
  ped_direccion_envio?: string;
  ped_notas?: string;
}

export interface PedidosProductos {
  ped_id: number;
  prod_id: string;
  pped_fecha_entrega?: string; // Date
  pped_cantidad?: number;
  pped_precio_unitario?: number; // Decimal
  pped_descuento?: number; // Decimal
  pped_total: number; // Decimal
  pped_estado?: number; // FK a EstadoPedidos
}

export interface Perfiles {
  id_perfil: number;
  nombre: string;
  descripcion?: string;
}

export interface Modulos {
  id_mod: number;
  nombre_mod: string;
  descripcion?: string;
  url_mod: string;
  padre_mod?: number; // FK a self
}

export interface PerfilPermisos {

  perfil_id: number; // FK a Perfiles
  mod_id: number; // FK a Modulos
  can_create: string; // 'Y'|'N'
  can_read: string; // 'Y'|'N'
  can_update: string; // 'Y'|'N'
  can_delete: string; // 'Y'|'N'
}

export interface Productos {
  prod_id: string;
  cat_id: string; // FK a Categoria
  prod_nombre: string;
  prod_descripcion?: string;
  prod_precio_venta?: number; // Decimal
  prod_stock?: number;
  prod_imagen_url?: string;
  prod_descuento?: number; // Decimal
}

export interface ProductosAuditoria {

  creation_date?: string; // Date
  au_type?: number;
  auditoria?: string;
}

export interface Roles {
  id_rol: number;
  nombre: string;
  descripcion?: string;
}

export interface Sexos {
  id_sexo: number;
  nombre_sexo: string;
}

export interface Usuarios {
  id_usuario: string;
  nombre: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  fecha_nacimiento?: string; // Date
  password_hash?: string;
  usuario_id_sexo: number; // FK a Sexos
  usuario_id_perfil: number; // FK a Perfiles
  activo?: number; // Float
}

export interface ConfigContacto {
  id_regla: number;
  nombre_contacto: string;
  descripcion?: string;
  regex_val?: string;
  min_length?: number; // Float
  max_length?: number; // Float
  mensaje_error: string;
}

export interface Contactos {
  id_contacto: number;
  tipo_contacto?: number; // FK a Config_Contacto
  dato_contacto: string;
  id_usuario?: string; // FK a Usuarios
}