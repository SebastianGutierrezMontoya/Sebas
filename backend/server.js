const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { randomUUID } = require('crypto');

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

// Listar todas las categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT cat_id, cat_nombre, cat_descripcion FROM categoria ORDER BY cat_nombre');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Obtener una categoría por ID
app.get('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT cat_id, cat_nombre, cat_descripcion FROM categoria WHERE cat_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Categoría no encontrada');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener categoría:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Crear una nueva categoría
app.post('/api/categorias', async (req, res) => {
  const { cat_id, cat_nombre, cat_descripcion } = req.body;

  // Generar ID si no se envía
  const id = cat_id || randomUUID().slice(0, 10);

  try {
    const result = await pool.query(
      'INSERT INTO categoria (cat_id, cat_nombre, cat_descripcion) VALUES ($1, $2, $3) RETURNING cat_id, cat_nombre, cat_descripcion',
      [id, cat_nombre, cat_descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).send('Error al insertar');
  }
});

// Actualizar una categoría
app.put('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { cat_nombre, cat_descripcion } = req.body;

  try {
    const result = await pool.query(
      'UPDATE categoria SET cat_nombre = $1, cat_descripcion = $2 WHERE cat_id = $3 RETURNING cat_id, cat_nombre, cat_descripcion',
      [cat_nombre, cat_descripcion, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Categoría no encontrada');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    res.status(500).send('Error en la base de datos');
  }
});

// Eliminar una categoría
app.delete('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categoria WHERE cat_id = $1 RETURNING cat_id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Categoría no encontrada');
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    res.status(500).send('Error en la base de datos');
  }
});

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});