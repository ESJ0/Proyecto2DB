-- =========================
-- TABLA: Proveedor
-- =========================
CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- =========================
-- TABLA: Cliente
-- =========================
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    CONSTRAINT chk_email_cliente CHECK (email LIKE '%@%.%')
);

-- =========================
-- TABLA: Categoria
-- =========================
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- =========================
-- TABLA: Empleado
-- =========================
CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    fecha_contra DATE NOT NULL,
    CONSTRAINT chk_fecha_empleado CHECK (fecha_contra <= CURRENT_DATE)
);

-- =========================
-- TABLA: Producto
-- =========================
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    genero VARCHAR(10) NOT NULL,
    precio_actual NUMERIC(10,2) NOT NULL,
    imagen TEXT NOT NULL,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
        ON DELETE RESTRICT,

    CONSTRAINT fk_producto_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE RESTRICT,

    CONSTRAINT chk_genero
        CHECK (genero IN ('M', 'F', 'Unisex')),

    CONSTRAINT chk_precio_producto
        CHECK (precio_actual > 0)
);

-- =========================
-- TABLA: ProductoVariante
-- =========================
CREATE TABLE producto_variante (
    id_variante SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,
    talla VARCHAR(10) NOT NULL,
    color VARCHAR(30) NOT NULL,
    peso NUMERIC(10,2) NOT NULL,
    alto NUMERIC(10,2) NOT NULL,
    ancho NUMERIC(10,2) NOT NULL,
    largo NUMERIC(10,2) NOT NULL,
    stock_total INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_variante_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE CASCADE,

    CONSTRAINT chk_peso CHECK (peso > 0),
    CONSTRAINT chk_alto CHECK (alto > 0),
    CONSTRAINT chk_ancho CHECK (ancho > 0),
    CONSTRAINT chk_largo CHECK (largo > 0),
    CONSTRAINT chk_stock CHECK (stock_total >= 0)
);

-- =========================
-- TABLA: Venta
-- =========================
CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(20) NOT NULL,

    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE RESTRICT,

    CONSTRAINT fk_venta_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado)
        ON DELETE RESTRICT,

    CONSTRAINT chk_metodo_pago
        CHECK (metodo_pago IN ('Efectivo', 'Tarjeta'))
);

-- =========================
-- TABLA: DetalleVenta
-- =========================
CREATE TABLE detalle_venta (
    id_venta INT NOT NULL,
    id_variante INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,

    PRIMARY KEY (id_venta, id_variante),

    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_variante
        FOREIGN KEY (id_variante)
        REFERENCES producto_variante(id_variante)
        ON DELETE CASCADE,

    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_precio_detalle CHECK (precio_unitario > 0)
);

-- ============================================================
-- Índices justificados
-- ============================================================

-- Búsquedas frecuentes de productos por categoría
CREATE INDEX idx_producto_categoria ON Producto(id_categoria);

-- Búsquedas de ventas por fecha (reportes)
CREATE INDEX idx_venta_fecha ON Venta(fecha);

-- Búsquedas de variantes por producto
CREATE INDEX idx_variante_producto ON ProductoVariante(id_producto);

-- ============================================================
-- VISTAS
-- ============================================================

-- Vista usada por el reporte de ventas por empleado
CREATE VIEW vista_ventas_empleado AS
SELECT
  e.id_empleado,
  e.nombre AS empleado,
  e.cargo,
  COUNT(v.id_venta) AS total_ventas,
  SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
FROM Empleado e
JOIN Venta v ON e.id_empleado = v.id_empleado
JOIN DetalleVenta dv ON v.id_venta = dv.id_venta
GROUP BY e.id_empleado, e.nombre, e.cargo;

-- Vista usada por el reporte de productos mas vendidos
CREATE VIEW vista_productos_mas_vendidos AS
SELECT
  p.id_producto,
  p.nombre AS producto,
  p.marca,
  c.nombre AS categoria,
  SUM(dv.cantidad) AS unidades_vendidas,
  SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
FROM Producto p
JOIN Categoria c ON p.id_categoria = c.id_categoria
JOIN ProductoVariante pv ON p.id_producto = pv.id_producto
JOIN DetalleVenta dv ON pv.id_variante = dv.id_variante
GROUP BY p.id_producto, p.nombre, p.marca, c.nombre;