# Backend API (Node + Express + PostgreSQL)

Este backend es una API REST simple que usa PostgreSQL para almacenar datos.
El proyecto está diseñado para usarse junto con el frontend Angular del mismo repositorio.

## 1) Ejecutar el servidor

Desde la carpeta `backend`:

```bash
npm install
npm run dev
```

- `npm run dev` ejecuta el servidor con `nodemon` (reinicia automáticamente).
- La API queda disponible en: `http://localhost:3000`

---

## 2) Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y en ejecución.

El archivo `server.js` usa esta configuración de conexión:

```js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Reemplaza con tu DB
  password: 'qwer1234', // Reemplaza con tu contraseña
  port: 5432,
});
```

Cambia `database` y `password` según tu instalación.

---

## 3) SQL para crear la tabla `categoria`

Ejecuta en tu base de datos (pgAdmin o `psql`):

```sql
CREATE TABLE IF NOT EXISTS categoria (
  cat_id VARCHAR(10) PRIMARY KEY,
  cat_nombre VARCHAR(50) UNIQUE NOT NULL,
  cat_descripcion VARCHAR(200)
);
```

Opcional: insertar datos de prueba:

```sql
INSERT INTO categoria (cat_id, cat_nombre, cat_descripcion)
VALUES
  ('COS', 'Cosplay', 'Descripción Cosplay'),
  ('ESP', 'Ediciones Especiales', 'Descripción Ediciones'),
  ('FIG', 'Figuras y Coleccionables', 'Descripción Figuras');
```

---

## 4) Endpoints disponibles

- `GET /api/categorias` → Lista todas las categorías
- `GET /api/categorias/:id` → Trae una categoría por ID
- `POST /api/categorias` → Crea categoría
- `PUT /api/categorias/:id` → Actualiza categoría
- `DELETE /api/categorias/:id` → Elimina categoría

---

## 5) Conexión con Angular

El servicio Angular `CategoriaService` apunta a:

```ts
private apiUrl = 'http://localhost:3000/api/categorias';
```

Asegúrate de que el backend esté corriendo antes de iniciar Angular.
