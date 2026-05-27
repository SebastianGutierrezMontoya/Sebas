
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { randomUUID, createHash } = require('crypto');
const jwt = require('jsonwebtoken');
const createCrudRoutes = require('./routes/crud.routes');

const app = express();
const port = 3000; // Puerto donde correrá la API
const JWT_SECRET = 'tu_clave_secreta_aqui'; // Cambia esto por una variable de entorno en producción

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Reemplaza con tu DB
  password: 'qwer1234', // Reemplaza con tu contraseña
  port: 5432,
});

app.use(cors()); // Permite solicitudes desde Angular
app.use(express.json()); // Para parsear JSON en requests

// Función para hashear contraseña con SHA256 (compatible con Django)
const hashPassword = (password) => {
  return createHash('sha256').update(password).digest('hex');
};

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// RUTAS DE AUTENTICACIÓN
app.post('/api/auth/registro', async (req, res) => {
  const { id_usuario, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, password, usuario_id_sexo } = req.body;

  try {
    // Validar que el usuario no exista
    const usuarioExistente = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE id_usuario = $1',
      [id_usuario]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña con SHA256 (compatible con Django)
    const hashedPassword = hashPassword(password);

    // Crear usuario
    const resultado = await pool.query(
      `INSERT INTO usuarios (id_usuario, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, password_hash, usuario_id_sexo, usuario_id_perfil, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 1, 1)
       RETURNING id_usuario, nombre, primer_apellido, segundo_apellido, usuario_id_sexo`,
      [id_usuario, nombre, primer_apellido, segundo_apellido || null, fecha_nacimiento || null, hashedPassword, usuario_id_sexo]
    );

    const usuario = resultado.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nombre: usuario.nombre },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      usuario,
      message: 'Registro exitoso'
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error al registrar: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { id_usuario, password } = req.body;

  try {
    // Buscar usuario
    const resultado = await pool.query(
      'SELECT id_usuario, nombre, primer_apellido, segundo_apellido, password_hash, usuario_id_perfil FROM usuarios WHERE id_usuario = $1',
      [id_usuario]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const usuario = resultado.rows[0];

    // Verificar contraseña - hashear y comparar con SHA256
    const passwordHash = hashPassword(password);
    const passwordValida = passwordHash === usuario.password_hash;

    if (!passwordValida) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Obtener permisos del perfil del usuario
    const permisosResultado = await pool.query(
      `SELECT perfil_id, mod_id, can_read, can_create, can_update, can_delete 
       FROM perfilpermisos 
       WHERE perfil_id = $1`,
      [usuario.usuario_id_perfil]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nombre: usuario.nombre },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // No devolver la contraseña
    const usuarioSinPassword = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      primer_apellido: usuario.primer_apellido,
      segundo_apellido: usuario.segundo_apellido,
      usuario_id_perfil: usuario.usuario_id_perfil
    };

    res.json({
      token,
      usuario: usuarioSinPassword,
      permisos: permisosResultado.rows,
      message: 'Inicio de sesión exitoso'
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error al iniciar sesión: ' + err.message });
  }
});


app.put('/api/usuarios/changepassword', async (req, res) => {
  const { id_usuario, password, new_password } = req.body;

  try {
    // Buscar usuario
    const resultado = await pool.query(
      'SELECT id_usuario, nombre, primer_apellido, segundo_apellido, password_hash, usuario_id_perfil FROM usuarios WHERE id_usuario = $1',
      [id_usuario]
    );

    const usuario = resultado.rows[0];


    const passwordHash = hashPassword(password);
    const passwordValida = passwordHash === usuario.password_hash;

    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }


    // Hashear la nueva contraseña
    const hashedNewPassword = hashPassword(new_password);

    const result = await pool.query(
      `UPDATE usuarios
       SET password_hash = $2
       WHERE id_usuario = $1
       RETURNING id_usuario, nombre, primer_apellido`,
      [id_usuario, hashedNewPassword]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Contraseña actualizada exitosamente', usuario: result.rows[0] });


    } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ message: 'Error al cambiar contraseña: ' + err.message });
  }

});




// Ruta protegida de ejemplo para verificar token
app.get('/api/auth/verify', verificarToken, (req, res) => {
  res.json({ message: 'Token válido', usuario: req.usuario });
});


app.get('/api/productos', async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT prod_id, cat_id, prod_nombre, prod_descripcion,
             prod_precio_venta, prod_stock, prod_imagen_url, prod_descuento
      FROM productos
    `;

    let values = [];

    if (search) {
      query += ` WHERE prod_nombre ILIKE $1`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY prod_id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {
    res.status(500).send('DB error');
  }
});


app.get('/api/productos/categoria/:id_cat', async (req, res) => {
  const { id_cat } = req.params;

  // console.log(id_cat);

  try {
    const result = await pool.query( `
      SELECT prod_id, cat_id, prod_nombre, prod_descripcion,
             prod_precio_venta, prod_stock, prod_imagen_url, prod_descuento
      FROM productos
      WHERE cat_id = $1`,
      [id_cat]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).send('DB error');
  }
});


app.get('/api/productos-auditoria', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY creation_date DESC) AS id,
        creation_date,
        au_type,
        auditoria
      FROM productos_auditoria
    `);

    const data = result.rows.map(p => {
      let parsed = null;
      let differences = [];
      let product_name = null;

      try {
        parsed = JSON.parse(p.auditoria);

        const old = parsed?.old || {};
        const newVal = parsed?.new || {};

        if (p.au_type === 2) {
          for (const key of new Set([...Object.keys(old), ...Object.keys(newVal)])) {
            if (old[key] !== newVal[key]) {
              differences.push({
                field: key,
                old: old[key],
                new: newVal[key]
              });
            }
          }
        }

        product_name =
          old?.prod_nombre ||
          newVal?.prod_nombre ||
          parsed?.prod_nombre;

      } catch {}

      return {
        ...p,
        au_type_text:
          p.au_type === 1 ? 'Creación' :
          p.au_type === 2 ? 'Modificación' :
          p.au_type === 3 ? 'Eliminación' : 'Desconocido',
        differences,
        product_name
      };
    });
    
    res.json(data);

  } catch (err) {
    res.status(500).send('Error auditoría');
  }
});


app.get('/api/contactos/usuario/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      'SELECT id_contacto, tipo_contacto, dato_contacto FROM contactos WHERE id_usuario = $1',
      [id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener contactos:', err);
    res.status(500).send('Error en la base de datos');
  }
});

app.get('/api/pedidos', async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT ped_id, usu_id, ped_fecha_pedido, ped_total, ped_estado, ped_direccion_envio, ped_notas
      FROM pedidos
    `;
    let values = [];

    if (search) {
      query += ` WHERE ped_id::text ILIKE $1 OR usu_id::text ILIKE $1`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY ped_id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener pedidos:', err);
    res.status(500).send('Error en la base de datos');
  }
});

app.get('/api/pedidos/:id/pedidos_productos', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT prod_id, pped_fecha_entrega, pped_cantidad, pped_precio_unitario, pped_descuento, pped_total, pped_estado
       FROM pedidos_productos
        WHERE ped_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos del pedido:', err);
    res.status(500).send('Error en la base de datos');
  }
});


app.get('/api/pedidos/usuario/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `SELECT ped_id, usu_id, ped_fecha_pedido, ped_total, ped_estado, ped_direccion_envio, ped_notas
       FROM pedidos
        WHERE usu_id = $1`,
      [id_usuario]
    );
    res.json(result.rows);
  }catch (err) {
    console.error('Error al obtener productos del pedido:', err);
    res.status(500).send('Error en la base de datos');
  }
});



app.get('/api/pedidos_productos/pedido/:pedido_id', async (req, res) => {
  const { pedido_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT prod_id, pped_fecha_entrega, pped_cantidad, pped_precio_unitario, pped_descuento, pped_total, pped_estado
        FROM pedidos_productos
        WHERE ped_id = $1`,
      [pedido_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener producto del pedido:', err);
    res.status(500).send('Error en la base de datos');
  }
});

app.put('/api/pedidos_productos/:ped_id/:prod_id', async (req, res) => {
  const { ped_id, prod_id } = req.params;
  const { pped_fecha_entrega, pped_cantidad, pped_precio_unitario, pped_descuento, pped_total, pped_estado } = req.body;

  try {
    const result = await pool.query(
      `UPDATE pedidos_productos
        SET pped_fecha_entrega = $1, pped_cantidad = $2, pped_precio_unitario = $3, pped_descuento = $4, pped_total = $5, pped_estado = $6
        WHERE ped_id = $7 AND prod_id = $8
        RETURNING ped_id, prod_id, pped_fecha_entrega, pped_cantidad, pped_precio_unitario, pped_descuento, pped_total, pped_estado`,
      [pped_fecha_entrega, pped_cantidad, pped_precio_unitario, pped_descuento, pped_total, pped_estado, ped_id, prod_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar producto del pedido:', err);
    res.status(500).send('Error en la base de datos');
  }
});


app.delete('/api/pedidos_productos/:ped_id/:prod_id', async (req, res) => {
  const { ped_id, prod_id } = req.params;
  try {
    await pool.query(
      `DELETE FROM pedidos_productos WHERE ped_id = $1 AND prod_id = $2`,
      [ped_id, prod_id]
    );
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar producto del pedido:', err);
    res.status(500).send('Error en la base de datos');
  }
});

app.get('/api/pedidos_productos/:ped_id/:prod_id', async (req, res) => {
  const { ped_id, prod_id } = req.params; 
  try {
    const result = await pool.query(
      `SELECT ped_id, prod_id, pped_fecha_entrega, pped_cantidad, pped_precio_unitario, pped_descuento, pped_total, pped_estado
       FROM pedidos_productos
       WHERE ped_id = $1 AND prod_id = $2`,
      [ped_id, prod_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener producto del pedido:', err);
    res.status(500).send('Error en la base de datos');
  }
});

/**
 * Categorías
 * Asume la existencia de la tabla "categoria" con columnas:
 *  - cat_id (PK VARCHAR)
 *  - cat_nombre (VARCHAR)
 *  - cat_descripcion (VARCHAR)
 */

// // Listar todas las categorías
// app.get('/api/categorias', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT cat_id, cat_nombre, cat_descripcion FROM categoria ORDER BY cat_nombre');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error al obtener categorías:', err);
//     res.status(500).send('Error en la base de datos');
//   }
// });

// // Obtener una categoría por ID
// app.get('/api/categorias/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       'SELECT cat_id, cat_nombre, cat_descripcion FROM categoria WHERE cat_id = $1',
//       [id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).send('Categoría no encontrada');
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Error al obtener categoría:', err);
//     res.status(500).send('Error en la base de datos');
//   }
// });

// // Crear una nueva categoría
// app.post('/api/categorias', async (req, res) => {
//   const { cat_id, cat_nombre, cat_descripcion } = req.body;

//   // Generar ID si no se envía
//   const id = cat_id || randomUUID().slice(0, 10);

//   try {
//     const result = await pool.query(
//       'INSERT INTO categoria (cat_id, cat_nombre, cat_descripcion) VALUES ($1, $2, $3) RETURNING cat_id, cat_nombre, cat_descripcion',
//       [id, cat_nombre, cat_descripcion]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error al crear categoría:', err);
//     res.status(500).send('Error al insertar');
//   }
// });

// // Actualizar una categoría
// app.put('/api/categorias/:id', async (req, res) => {
//   const { id } = req.params;
//   const { cat_nombre, cat_descripcion } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE categoria SET cat_nombre = $1, cat_descripcion = $2 WHERE cat_id = $3 RETURNING cat_id, cat_nombre, cat_descripcion',
//       [cat_nombre, cat_descripcion, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).send('Categoría no encontrada');
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Error al actualizar categoría:', err);
//     res.status(500).send('Error en la base de datos');
//   }
// });

// // Eliminar una categoría
// app.delete('/api/categorias/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query('DELETE FROM categoria WHERE cat_id = $1 RETURNING cat_id', [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).send('Categoría no encontrada');
//     }
//     res.status(204).send();
//   } catch (err) {
//     console.error('Error al eliminar categoría:', err);
//     res.status(500).send('Error en la base de datos');
//   }
// });








// Rutas especiales para permisos por perfil
// Obtener permisos de un perfil específico
app.get('/api/perfil-permisos/perfil/:perfilId', async (req, res) => {
  const { perfilId } = req.params;
  try {
    const result = await pool.query(
      `SELECT perfil_id, mod_id, can_read, can_create, can_update, can_delete 
       FROM perfilpermisos 
       WHERE perfil_id = $1`,
      [perfilId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener permisos del perfil:', err);
    res.status(500).json({ message: 'Error al obtener permisos' });
  }
});

// Guardar múltiples permisos (upsert)
app.post('/api/perfil-permisos/guardar-permisos', async (req, res) => {
  const { perfil_id, permisos } = req.body;
  
  if (!perfil_id || !Array.isArray(permisos)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Primero, eliminar todos los permisos existentes del perfil
    await client.query(
      'DELETE FROM perfilpermisos WHERE perfil_id = $1',
      [perfil_id]
    );
    
    // Luego insertar todos los nuevos permisos
    const insertPromises = permisos.map(permiso => {
      return client.query(
        `INSERT INTO perfilpermisos (perfil_id, mod_id, can_read, can_create, can_update, can_delete)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          perfil_id,
          permiso.mod_id,
          permiso.can_read || 'N',
          permiso.can_create || 'N',
          permiso.can_update || 'N',
          permiso.can_delete || 'N'
        ]
      );
    });
    
    await Promise.all(insertPromises);
    await client.query('COMMIT');
    
    res.json({ message: 'Permisos guardados exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al guardar permisos:', err);
    res.status(500).json({ message: 'Error al guardar permisos: ' + err.message });
  } finally {
    client.release();
  }
});

// Ejecutar consulta dinámica
app.post('/api/consultas-dinamicas/ejecutar', async (req, res) => {
  const { sql } = req.body;

  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ message: 'SQL no válido' });
  }

  // Validaciones de seguridad básicas (puedes mejorar esto)
  const sqlUpper = sql.toUpperCase().trim();
  if (sqlUpper.includes('DELETE') || sqlUpper.includes('DROP') || sqlUpper.includes('TRUNCATE') || sqlUpper.includes('INSERT') || sqlUpper.includes('UPDATE')) {
    return res.status(403).json({ message: 'Las operaciones de modificación no están permitidas. Solo SELECT.' });
  }

  try {
    const result = await pool.query(sql);
    res.json({
      success: true,
      data: result.rows,
      columns: result.fields ? result.fields.map(f => f.name) : Object.keys(result.rows[0] || {})
    });
  } catch (err) {
    console.error('Error al ejecutar consulta:', err);
    res.status(400).json({ 
      success: false, 
      message: 'Error en la consulta SQL', 
      error: err.message 
    });
  }
});



app.post('/api/config_contacto/crear', async (req, res) => {
  const { nombre_contacto, descripcion, regex_val, min_length, max_length, mensaje_error } = req.body;
  try {    const result = await pool.query(
      `INSERT INTO config_contacto (nombre_contacto, descripcion, regex_val, min_length, max_length, mensaje_error)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_regla, nombre_contacto, descripcion, regex_val, min_length, max_length, mensaje_error`,
      [nombre_contacto, descripcion, regex_val, min_length, max_length, mensaje_error]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear regla de contacto:', err);
    res.status(500).send('Error al insertar');
  } 
});


// Registrar endpoints dinámicos
createCrudRoutes(app, 'categorias', 'categoria', 'cat_id', [
  'cat_id',
  'cat_nombre',
  'cat_descripcion'
]);

createCrudRoutes(app, 'productos', 'productos', 'prod_id', [
  'prod_id',
  'cat_id',
  'prod_nombre',
  'prod_descripcion',
  'prod_precio_venta',
  'prod_stock',
  'prod_imagen_url',
  'prod_descuento'
]);

createCrudRoutes(app, 'usuarios', 'usuarios', 'id_usuario', [
  'id_usuario',
  'nombre',
  'primer_apellido',
  'segundo_apellido',
  'fecha_nacimiento',
  'password_hash',
  'usuario_id_sexo',
  'usuario_id_perfil',
  'activo'
]);


createCrudRoutes(app, 'consultas_dinamicas', 'consultas_dinamicas', 'cons_id', [
  'cons_id',
  'cons_nombre',
  'cons_sql',
  'cons_descripcion'
]);

createCrudRoutes(app, 'estadopedidos', 'estadopedidos', 'est_id', [
  'est_id',
  'est_nombre'
]);



createCrudRoutes(app, 'pedidos', 'pedidos', 'ped_id', [
  'ped_id',
  'usu_id',
  'ped_fecha_pedido',
  'ped_total',
  'ped_estado',
  'ped_direccion_envio',
  'ped_notas'
]);



createCrudRoutes(app, 'pedidos_productos', 'pedidos_productos', 'ped_id', [
  'ped_id',
  'prod_id',
  'pped_fecha_entrega',
  'pped_cantidad',
  'pped_precio_unitario',
  'pped_descuento',
  'pped_total',
  'pped_estado'
]);



createCrudRoutes(app, 'perfiles', 'perfiles', 'id_perfil', [
  'id_perfil',
  'nombre',
  'descripcion',
  'rol_id'
]);



createCrudRoutes(app, 'modulos', 'modulos', 'id_mod', [
  'id_mod',
  'nombre_mod',
  'descripcion',
  'url_mod',
  'padre_mod'
]);


createCrudRoutes(app, 'perfil-permisos', 'perfilpermisos', 'perfil_id', [
  'perfil_id',
  'mod_id',
  'can_create',
  'can_read',
  'can_update',
  'can_delete'
]);





createCrudRoutes(app, 'productos_auditoria', 'productos_auditoria', 'creation_date', [
  'creation_date',
  'au_type',
  'auditoria'
]);


createCrudRoutes(app, 'roles', 'roles', 'id_rol', [
  'id_rol',
  'nombre',
  'descripcion'
]);


createCrudRoutes(app, 'sexos', 'sexos', 'id_sexo', [
  'id_sexo',
  'nombre_sexo'
]);




createCrudRoutes(app, 'config_contacto', 'config_contacto', 'id_regla', [
  'id_regla',
  'nombre_contacto',
  'descripcion',
  'regex_val',
  'min_length',
  'max_length',
  'mensaje_error'
]);


createCrudRoutes(app, 'contactos', 'contactos', 'id_contacto', [
  'id_contacto',
  'tipo_contacto',
  'dato_contacto',
  'id_usuario'
]);
 

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});



