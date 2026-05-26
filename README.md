# Proyecto 3 — ESJO SHOP Inventory
**cc3088 Bases de Datos 1 · Ciclo 1, 2026**

Aplicación web full-stack para gestión de inventario y ventas de una tienda de calzado.  
Stack: **PostgreSQL · Node.js / Express · Sequelize ORM · React + Vite · Docker**

---

## Levantar el proyecto desde cero

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd Proyecto2DB

# 2. Cambiar a la rama del proyecto
git checkout proyecto-3

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Levantar todos los servicios
docker compose up --build
```

La primera vez Docker inicializa PostgreSQL automáticamente con `schema.sql` (tablas, roles, stored procedures, vistas) y `seed.sql` (datos de prueba + usuarios por rol).

| Servicio   | URL                    |
|------------|------------------------|
| Frontend   | http://localhost:5173  |
| Backend    | http://localhost:3000  |
| PostgreSQL | localhost:5432         |

---

## Credenciales de base de datos (fijas para calificación)

```
Usuario:    proy3
Contraseña: secret
Base:       tienda
```

---

## Usuarios de prueba (uno por rol)

| Username         | Contraseña      | Rol          |
|------------------|-----------------|--------------|
| admin_user       | admin123        | admin        |
| vendedor_user    | vendedor123     | vendedor     |
| inventario_user  | inventario123   | inventario   |
| reportes_user    | reportes123     | reportes     |
| cliente_user     | cliente123      | cliente_web  |

---

## Esquema de roles en el DBMS

Los roles se definen en el DBMS con `CREATE ROLE` y permisos granulares con `GRANT` / `REVOKE` en `database/schema.sql`.

| Rol              | Tablas con acceso                                              | Operaciones permitidas                        |
|------------------|----------------------------------------------------------------|-----------------------------------------------|
| rol_admin        | Todas                                                          | SELECT, INSERT, UPDATE, DELETE                |
| rol_vendedor     | producto, producto_variante, categoria, cliente, venta, detalle_venta, empleado | SELECT en catálogo; INSERT en ventas y clientes |
| rol_inventario   | producto, producto_variante, categoria, proveedor              | SELECT, INSERT, UPDATE, DELETE                |
| rol_reportes     | Todas (solo lectura)                                           | SELECT                                        |
| rol_cliente_web  | producto, producto_variante, categoria                         | SELECT                                        |

---

## Stored Procedures

Todos los stored procedures se invocan desde el backend (nunca desde scripts independientes).

| Procedure                    | Descripción                                                   | Parámetros OUT        | Excepciones |
|------------------------------|---------------------------------------------------------------|-----------------------|-------------|
| `sp_registrar_venta`         | Registra una venta completa con validación de stock y ROLLBACK | `p_id_venta`, `p_total` | Stock insuficiente, variante no encontrada |
| `sp_crear_producto`          | Inserta un producto con validaciones de negocio               | `p_id_producto`       | SKU duplicado, categoría/proveedor inexistente |
| `sp_actualizar_stock`        | Ajusta el stock de una variante (ajuste, devolución, merma)   | `p_stock_nuevo`       | Variante no encontrada, stock negativo |
| `sp_reporte_ventas_periodo`  | Totaliza ventas entre dos fechas                              | `p_total_ventas`, `p_total_ingresos` | Fecha inicio > fecha fin |
| `sp_crear_categoria`         | Inserta una categoría con validación de nombre único          | `p_id_categoria`      | Nombre vacío, nombre duplicado |

### Transacción explícita con ROLLBACK

`sp_registrar_venta` implementa una transacción explícita:
1. Verifica stock disponible de cada variante (`FOR UPDATE`).
2. Inserta el encabezado de la venta.
3. Inserta cada línea de detalle.
4. Descuenta el stock por variante.

Si cualquier paso falla se ejecuta `ROLLBACK` y se retorna un error claro al usuario.

---

## ORM — Sequelize

Las siguientes entidades usan **Sequelize** para todas sus operaciones CRUD:

| Entidad     | Modelo                          | Operaciones ORM                            |
|-------------|---------------------------------|--------------------------------------------|
| Categorías  | `models/categoria.js`           | findAll, findByPk, create, update, destroy |
| Clientes    | `models/cliente.js`             | findAll, findByPk, create, update, destroy |
| Proveedores | `models/proveedor.js`           | findAll, findByPk, create, update, destroy |
| Productos   | `models/producto.js`            | findByPk, update, destroy                  |
| Usuarios    | `models/usuario.js`             | findOne, findByPk (autenticación)          |

Las consultas avanzadas (reportes, JOINs, CTEs) se complementan con SQL explícito via `pg` pool.

---

## Estructura del proyecto

```
Proyecto2DB/
├── database/
│   ├── schema.sql        # DDL: tablas, índices, vistas, roles, stored procedures
│   └── seed.sql          # Datos de prueba (25+ registros por tabla) + usuarios por rol
├── backend/
│   └── src/
│       ├── controllers/  # Lógica HTTP por entidad
│       ├── daos/         # Queries SQL explícitas para reportes y JOINs
│       ├── middlewares/  # requireAuth, requireRole, validateBody, errorHandler
│       ├── models/       # Modelos Sequelize (Categoria, Cliente, Proveedor, Producto, Usuario)
│       ├── routes/       # Rutas REST protegidas por rol
│       ├── services/     # Lógica de negocio con transacciones
│       ├── context/      # withTransaction (BEGIN/COMMIT/ROLLBACK)
│       └── database/     # Pool pg + instancia Sequelize
├── frontend/
│   └── src/
│       ├── api/          # Fetch al backend
│       ├── pages/        # Vistas (Dashboard, Productos, Ventas, etc.)
│       ├── components/   # Table, Modal, ConfirmModal, PermissionDeniedModal, etc.
│       ├── layouts/      # MainLayout con navegación lateral por rol
│       ├── hooks/        # useFetch, useForm
│       ├── context/      # AuthContext (JWT)
│       ├── routes/       # AppRoutes con ProtectedRoute por rol
│       └── utils/        # formatters, permissions
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

## Variables de entorno (.env)

```env
# Base de datos
DB_HOST=db
DB_PORT=5432
DB_NAME=tienda
DB_USER=proy3
DB_PASSWORD=secret

# Backend
PORT=3000

# JWT
JWT_SECRET=supersecretOjwt2026

# Frontend
VITE_API_URL=http://localhost:3000/api
```