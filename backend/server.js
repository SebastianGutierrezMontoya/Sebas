
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { randomUUID } = require('crypto');
const createCrudRoutes = require('./routes/crud.routes');

const app = express();
const port = 3000; // Puerto donde correrá la API

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
  'prod_precio_venta'
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
  'descripcion'
]);



createCrudRoutes(app, 'modulos', 'modulos', 'id_mod', [
  'id_mod',
  'nombre_mod',
  'descripcion',
  'url_mod',
  'padre_mod'
]);


createCrudRoutes(app, 'perfilpermisos', 'perfilpermisos', 'perfil_id', [
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



