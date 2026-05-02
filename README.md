# Proyecto 2 — SOLE Inventory
**cc3088 Bases de Datos 1 · Ciclo 1, 2026**

Aplicación web full-stack para gestión de inventario y ventas de una tienda de calzado.  
Stack: **PostgreSQL · Node.js / Express · React + Vite · Docker**

---

## Levantar el proyecto desde cero

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd Proyecto2DB

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar todos los servicios
docker compose up --build
```

La primera vez Docker inicializa PostgreSQL automáticamente con `schema.sql` y `seed.sql`.

| Servicio   | URL                    |
|------------|------------------------|
| Frontend   | http://localhost:5173  |
| Backend    | http://localhost:3000  |
| PostgreSQL | localhost:5432         |

---

## Credenciales de base de datos (fijas para calificación)

```
Usuario:    proy2
Contraseña: secret
Base:       tienda
```

---

## Estructura del proyecto

```
Proyecto2DB/
├── database/
│   ├── schema.sql        # DDL completo (tablas, índices, vistas)
│   └── seed.sql          # Datos de prueba (25+ registros por tabla)
├── backend/
│   └── src/
│       ├── controllers/  # Lógica HTTP por entidad
│       ├── daos/         # Queries SQL explícitas (sin ORM)
│       ├── middlewares/  # Validación de body, manejo de errores
│       ├── routes/       # Definición de rutas REST
│       ├── services/     # Lógica de negocio (transacciones)
│       ├── context/      # withTransaction (BEGIN/COMMIT/ROLLBACK)
│       └── database/     # Pool de conexión PostgreSQL
├── frontend/
│   └── src/
│       ├── api/          # Fetch al backend
│       ├── pages/        # Vistas (Dashboard, Productos, Ventas, etc.)
│       ├── components/   # Componentes reutilizables (Table, Modal, etc.)
│       ├── layouts/      # MainLayout con navegación lateral
│       ├── hooks/        # useFetch, useForm
│       └── utils/        # formatters (moneda, fecha)
├── docker-compose.yml
├── .env
└── .env.example
```

---

## Entidades y CRUD

| Entidad       | Crear | Leer | Actualizar | Eliminar |
|---------------|:-----:|:----:|:----------:|:--------:|
| Categorías    | ✓     | ✓    | ✓          | ✓        |
| Proveedores   | ✓     | ✓    | ✓          | ✓        |
| Productos     | ✓     | ✓    | ✓          | ✓        |
| Variantes     | ✓     | ✓    | ✓          | ✓        |
| Clientes      | ✓     | ✓    | ✓          | ✓        |
| Empleados     | ✓     | ✓    | ✓          | ✓        |
| Ventas        | ✓     | ✓    | —          | —        |

---

## Reportes SQL (visibles en la UI)

| Reporte                      | Técnica SQL            |
|------------------------------|------------------------|
| Ventas detalladas            | JOIN (4 tablas)        |
| Inventario completo          | JOIN (4 tablas)        |
| Detalle ventas por producto  | JOIN (4 tablas)        |
| Clientes con compras         | Subquery EXISTS        |
| Stock bajo el promedio       | Subquery en WHERE      |
| Categorías más vendidas      | GROUP BY + HAVING      |
| Top productos del mes        | CTE (WITH)             |
| Ventas por empleado          | VIEW                   |
| Productos más vendidos       | VIEW                   |

---

## Transacciones explícitas

El registro de ventas usa una transacción explícita con `BEGIN / COMMIT / ROLLBACK`:

1. Verifica stock disponible por cada variante.
2. Inserta el encabezado de la venta.
3. Inserta cada línea de detalle.
4. Descuenta el stock de cada variante.

Si cualquier paso falla (stock insuficiente, variante inexistente, error de BD), se ejecuta `ROLLBACK` automático y se retorna un error claro al usuario.

Implementación: `backend/src/context/db.context.js` + `backend/src/service/ventas.service.js`

---

## Variables de entorno (.env)

```env
# Base de datos
DB_HOST=db
DB_PORT=5432
DB_NAME=tienda
DB_USER=proy2
DB_PASSWORD=secret

# Backend
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000/api
```