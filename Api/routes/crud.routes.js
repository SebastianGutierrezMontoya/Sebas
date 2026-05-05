const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Reemplaza con tu DB
  password: 'qwer1234', // Reemplaza con tu contraseña
  port: 5432,
});

function createCrudRoutes(app, basePath, tableName, idField, fields) {

  app.get(`/api/${basePath}`, async (req, res) => {
    const result = await pool.query(
      `SELECT ${fields.join(', ')} FROM ${tableName}`
    );
    res.json(result.rows);
  });

  app.get(`/api/${basePath}/:id`, async (req, res) => {
    const result = await pool.query(
      `SELECT ${fields.join(', ')} FROM ${tableName} WHERE ${idField} = $1`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  });

  app.post(`/api/${basePath}`, async (req, res) => {
    const values = fields.map(f => req.body[f]);
    const placeholders = fields.map((_, i) => `$${i + 1}`);

    const result = await pool.query(
      `INSERT INTO ${tableName} (${fields.join(', ')})
       VALUES (${placeholders.join(', ')})
       RETURNING ${fields.join(', ')}`,
      values
    );

    res.json(result.rows[0]);
  });

  app.put(`/api/${basePath}/:id`, async (req, res) => {
    const updateFields = fields.filter(f => f !== idField);

    const setClause = updateFields.map((f, i) => `${f} = $${i + 1}`);
    const values = updateFields.map(f => req.body[f]);

    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE ${tableName}
       SET ${setClause.join(', ')}
       WHERE ${idField} = $${values.length}
       RETURNING ${fields.join(', ')}`,
      values
    );

    res.json(result.rows[0]);
  });

  app.delete(`/api/${basePath}/:id`, async (req, res) => {
    await pool.query(
      `DELETE FROM ${tableName} WHERE ${idField} = $1`,
      [req.params.id]
    );

    res.status(204).send();
  });
}

module.exports = createCrudRoutes;