-- =============================================================
-- TABLAS BASE
-- =============================================================

CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    telefono     VARCHAR(20),
    email        VARCHAR(100)
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    telefono   VARCHAR(20),
    email      VARCHAR(100) UNIQUE,
    CONSTRAINT chk_email_cliente CHECK (email LIKE '%@%.%')
);

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE,
    descripcion  TEXT
);

CREATE TABLE empleado (
    id_empleado  SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    telefono     VARCHAR(20),
    email        VARCHAR(100) NOT NULL,
    fecha_contra DATE NOT NULL,
    CONSTRAINT chk_fecha_empleado CHECK (fecha_contra <= CURRENT_DATE)
);

CREATE TABLE producto (
    id_producto   SERIAL PRIMARY KEY,
    id_categoria  INT NOT NULL,
    id_proveedor  INT NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    sku           VARCHAR(50)  NOT NULL UNIQUE,
    marca         VARCHAR(50)  NOT NULL,
    descripcion   TEXT         NOT NULL,
    genero        VARCHAR(10)  NOT NULL,
    precio_actual NUMERIC(10,2) NOT NULL,
    imagen        TEXT         NOT NULL,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
        ON DELETE RESTRICT,
    CONSTRAINT fk_producto_proveedor
        FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
        ON DELETE RESTRICT,
    CONSTRAINT chk_genero       CHECK (genero IN ('M', 'F', 'Unisex')),
    CONSTRAINT chk_precio_producto CHECK (precio_actual > 0)
);

CREATE TABLE producto_variante (
    id_variante SERIAL PRIMARY KEY,
    id_producto INT          NOT NULL,
    talla       VARCHAR(10)  NOT NULL,
    color       VARCHAR(30)  NOT NULL,
    peso        NUMERIC(10,2) NOT NULL,
    alto        NUMERIC(10,2) NOT NULL,
    ancho       NUMERIC(10,2) NOT NULL,
    largo       NUMERIC(10,2) NOT NULL,
    stock_total INT          NOT NULL DEFAULT 0,

    CONSTRAINT fk_variante_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
        ON DELETE CASCADE,
    CONSTRAINT chk_peso  CHECK (peso  > 0),
    CONSTRAINT chk_alto  CHECK (alto  > 0),
    CONSTRAINT chk_ancho CHECK (ancho > 0),
    CONSTRAINT chk_largo CHECK (largo > 0),
    CONSTRAINT chk_stock CHECK (stock_total >= 0)
);

CREATE TABLE venta (
    id_venta    SERIAL PRIMARY KEY,
    id_cliente  INT NOT NULL,
    id_empleado INT NOT NULL,
    fecha       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(20) NOT NULL,

    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)  REFERENCES cliente(id_cliente)  ON DELETE RESTRICT,
    CONSTRAINT fk_venta_empleado
        FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE RESTRICT,
    CONSTRAINT chk_metodo_pago CHECK (metodo_pago IN ('Efectivo', 'Tarjeta'))
);

CREATE TABLE detalle_venta (
    id_venta        INT NOT NULL,
    id_variante     INT NOT NULL,
    cantidad        INT          NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,

    PRIMARY KEY (id_venta, id_variante),

    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)    REFERENCES venta(id_venta)             ON DELETE CASCADE,
    CONSTRAINT fk_detalle_variante
        FOREIGN KEY (id_variante) REFERENCES producto_variante(id_variante) ON DELETE CASCADE,
    CONSTRAINT chk_cantidad      CHECK (cantidad        > 0),
    CONSTRAINT chk_precio_detalle CHECK (precio_unitario > 0)
);


-- =============================================================
-- TABLA DE USUARIOS 
-- =============================================================

CREATE TABLE usuario (
    id_usuario    SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol           VARCHAR(30)  NOT NULL,
    activo        BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_rol CHECK (
        rol IN ('admin', 'vendedor', 'inventario', 'reportes', 'cliente_web')
    )
);


-- =============================================================
-- ÍNDICES
-- =============================================================

CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_venta_fecha        ON venta(fecha);
CREATE INDEX idx_variante_producto  ON producto_variante(id_producto);
CREATE INDEX idx_usuario_username   ON usuario(username);


-- =============================================================
-- VISTAS 
-- =============================================================

CREATE VIEW vista_ventas_empleado AS
SELECT
    e.id_empleado,
    e.nombre AS empleado,
    COUNT(v.id_venta) AS total_ventas,
    SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
FROM empleado e
JOIN venta v         ON e.id_empleado = v.id_empleado
JOIN detalle_venta dv ON v.id_venta   = dv.id_venta
GROUP BY e.id_empleado, e.nombre;

CREATE VIEW vista_productos_mas_vendidos AS
SELECT
    p.id_producto,
    p.nombre AS producto,
    p.marca,
    c.nombre AS categoria,
    SUM(dv.cantidad) AS unidades_vendidas,
    SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
FROM producto p
JOIN categoria         c  ON p.id_categoria = c.id_categoria
JOIN producto_variante pv ON p.id_producto  = pv.id_producto
JOIN detalle_venta     dv ON pv.id_variante = dv.id_variante
GROUP BY p.id_producto, p.nombre, p.marca, c.nombre;


-- =============================================================
-- ROLES EN EL DBMS 
-- =============================================================

-- Eliminar si ya existen para evitar errores al correr varias veces
DO $$
BEGIN
  DROP ROLE IF EXISTS rol_cliente_web;
  DROP ROLE IF EXISTS rol_reportes;
  DROP ROLE IF EXISTS rol_inventario;
  DROP ROLE IF EXISTS rol_vendedor;
  DROP ROLE IF EXISTS rol_admin;
EXCEPTION WHEN OTHERS THEN NULL;
END
$$;

-- ── 1. Administrador ──────────────────────────────────────────
-- Acceso total a todas las tablas y vistas
CREATE ROLE rol_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON
    proveedor, cliente, categoria, empleado,
    producto, producto_variante, venta, detalle_venta, usuario
TO rol_admin;

GRANT SELECT ON
    vista_ventas_empleado, vista_productos_mas_vendidos
TO rol_admin;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_admin;

-- ── 2. Vendedor ───────────────────────────────────────────────
-- Registra ventas, consulta catálogo e inventario
-- No puede modificar productos, proveedores ni gestionar usuarios
CREATE ROLE rol_vendedor;

GRANT SELECT ON
    producto, producto_variante, categoria, proveedor,
    cliente, empleado
TO rol_vendedor;

GRANT SELECT, INSERT ON venta, detalle_venta TO rol_vendedor;
GRANT INSERT ON cliente TO rol_vendedor;

GRANT SELECT ON
    vista_ventas_empleado, vista_productos_mas_vendidos
TO rol_vendedor;

GRANT USAGE, SELECT ON SEQUENCE
    venta_id_venta_seq,
    cliente_id_cliente_seq
TO rol_vendedor;

-- ── 3. Inventario ─────────────────────────────────────────────
-- Gestiona productos, variantes, categorías y proveedores
-- No puede registrar ventas ni ver usuarios
CREATE ROLE rol_inventario;

GRANT SELECT, INSERT, UPDATE, DELETE ON
    producto, producto_variante, categoria, proveedor
TO rol_inventario;

GRANT SELECT ON
    vista_productos_mas_vendidos
TO rol_inventario;

GRANT USAGE, SELECT ON SEQUENCE
    producto_id_producto_seq,
    producto_variante_id_variante_seq,
    categoria_id_categoria_seq,
    proveedor_id_proveedor_seq
TO rol_inventario;

-- ── 4. Reportes ───────────────────────────────────────────────
-- Solo lectura en todas las tablas y vistas
CREATE ROLE rol_reportes;

GRANT SELECT ON
    proveedor, cliente, categoria, empleado,
    producto, producto_variante, venta, detalle_venta
TO rol_reportes;

GRANT SELECT ON
    vista_ventas_empleado, vista_productos_mas_vendidos
TO rol_reportes;

-- ── 5. Cliente web ────────────────────────────────────────────
-- Acceso mínimo, solo consulta de catálogo público
CREATE ROLE rol_cliente_web;

GRANT SELECT ON producto, producto_variante, categoria TO rol_cliente_web;

-- Revocar explícitamente lo que NO debe ver
REVOKE ALL ON usuario    FROM rol_cliente_web;
REVOKE ALL ON empleado   FROM rol_cliente_web;
REVOKE ALL ON venta      FROM rol_cliente_web;
REVOKE ALL ON detalle_venta FROM rol_cliente_web;


-- =============================================================
-- USUARIO DE CONEXIÓN ÚNICO (proy3 / secret)
-- =============================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'proy3') THEN
    ALTER ROLE proy3 WITH LOGIN PASSWORD 'secret';
    GRANT rol_admin TO proy3;
  ELSE
    CREATE ROLE proy3 WITH LOGIN PASSWORD 'secret';
    GRANT rol_admin TO proy3;
  END IF;
END
$$;


-- ── SP 1: Registrar venta ─────────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_registrar_venta(
    IN  p_id_cliente   INT,
    IN  p_id_empleado  INT,
    IN  p_metodo_pago  VARCHAR,
    IN  p_items        JSONB,       
    OUT p_id_venta     INT,
    OUT p_total        NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_item          JSONB;
    v_id_variante   INT;
    v_cantidad      INT;
    v_precio        NUMERIC;
    v_stock_actual  INT;
    v_subtotal      NUMERIC := 0;
BEGIN
    -- Validar método de pago
    IF p_metodo_pago NOT IN ('Efectivo', 'Tarjeta') THEN
        ROLLBACK;
        RAISE EXCEPTION 'Método de pago inválido: %', p_metodo_pago
            USING ERRCODE = 'check_violation';
    END IF;

    -- Validar que haya al menos un item
    IF jsonb_array_length(p_items) = 0 THEN
        ROLLBACK;
        RAISE EXCEPTION 'La venta debe tener al menos un producto'
            USING ERRCODE = 'check_violation';
    END IF;

    -- ── BEGIN implícito en PROCEDURE ──────────────────────────
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_id_variante := (v_item->>'id_variante')::INT;
        v_cantidad    := (v_item->>'cantidad')::INT;

        SELECT stock_total INTO v_stock_actual
        FROM producto_variante
        WHERE id_variante = v_id_variante
        FOR UPDATE;  -- bloquear fila para evitar race conditions

        IF NOT FOUND THEN
            ROLLBACK;
            RAISE EXCEPTION 'Variante % no encontrada', v_id_variante
                USING ERRCODE = 'no_data_found';
        END IF;

        IF v_stock_actual < v_cantidad THEN
            ROLLBACK;
            RAISE EXCEPTION 'Stock insuficiente para variante %. Disponible: %, Solicitado: %',
                v_id_variante, v_stock_actual, v_cantidad
                USING ERRCODE = 'check_violation';
        END IF;
    END LOOP;

    -- Insertar encabezado de la venta
    INSERT INTO venta (id_cliente, id_empleado, metodo_pago)
    VALUES (p_id_cliente, p_id_empleado, p_metodo_pago)
    RETURNING id_venta INTO p_id_venta;

    -- Insertar cada línea de detalle y descontar stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_id_variante := (v_item->>'id_variante')::INT;
        v_cantidad    := (v_item->>'cantidad')::INT;
        v_precio      := (v_item->>'precio_unitario')::NUMERIC;

        INSERT INTO detalle_venta (id_venta, id_variante, cantidad, precio_unitario)
        VALUES (p_id_venta, v_id_variante, v_cantidad, v_precio);

        UPDATE producto_variante
        SET stock_total = stock_total - v_cantidad
        WHERE id_variante = v_id_variante;

        v_subtotal := v_subtotal + (v_cantidad * v_precio);
    END LOOP;

    p_total := v_subtotal;
    COMMIT;
END;
$$;


-- ── SP 2: Crear producto ──────────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_crear_producto(
    IN  p_id_categoria  INT,
    IN  p_id_proveedor  INT,
    IN  p_nombre        VARCHAR,
    IN  p_sku           VARCHAR,
    IN  p_marca         VARCHAR,
    IN  p_descripcion   TEXT,
    IN  p_genero        VARCHAR,
    IN  p_precio_actual NUMERIC,
    IN  p_imagen        TEXT,
    OUT p_id_producto   INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar que la categoría existe
    IF NOT EXISTS (SELECT 1 FROM categoria WHERE id_categoria = p_id_categoria) THEN
        RAISE EXCEPTION 'Categoría % no existe', p_id_categoria
            USING ERRCODE = 'foreign_key_violation';
    END IF;

    -- Validar que el proveedor existe
    IF NOT EXISTS (SELECT 1 FROM proveedor WHERE id_proveedor = p_id_proveedor) THEN
        RAISE EXCEPTION 'Proveedor % no existe', p_id_proveedor
            USING ERRCODE = 'foreign_key_violation';
    END IF;

    -- Validar precio
    IF p_precio_actual <= 0 THEN
        RAISE EXCEPTION 'El precio debe ser mayor a 0'
            USING ERRCODE = 'check_violation';
    END IF;

    -- Validar género
    IF p_genero NOT IN ('M', 'F', 'Unisex') THEN
        RAISE EXCEPTION 'Género inválido: %. Use M, F o Unisex', p_genero
            USING ERRCODE = 'check_violation';
    END IF;

    INSERT INTO producto
        (id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen)
    VALUES
        (p_id_categoria, p_id_proveedor, p_nombre, p_sku, p_marca, p_descripcion, p_genero, p_precio_actual, p_imagen)
    RETURNING id_producto INTO p_id_producto;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Ya existe un producto con el SKU "%"', p_sku
            USING ERRCODE = 'unique_violation';
    WHEN OTHERS THEN
        RAISE;
END;
$$;


-- ── SP 3: Actualizar stock ────────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_actualizar_stock(
    IN  p_id_variante   INT,
    IN  p_cantidad      INT,       
    IN  p_motivo        VARCHAR,   
    OUT p_stock_nuevo   INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_stock_actual INT;
BEGIN
    SELECT stock_total INTO v_stock_actual
    FROM producto_variante
    WHERE id_variante = p_id_variante
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Variante % no encontrada', p_id_variante
            USING ERRCODE = 'no_data_found';
    END IF;

    IF p_motivo NOT IN ('ajuste', 'devolucion', 'merma') THEN
        RAISE EXCEPTION 'Motivo inválido: %. Use ajuste, devolucion o merma', p_motivo
            USING ERRCODE = 'check_violation';
    END IF;

    -- Evitar stock negativo en salidas
    IF (v_stock_actual + p_cantidad) < 0 THEN
        RAISE EXCEPTION 'Stock insuficiente. Actual: %, Ajuste solicitado: %',
            v_stock_actual, p_cantidad
            USING ERRCODE = 'check_violation';
    END IF;

    UPDATE producto_variante
    SET stock_total = stock_total + p_cantidad
    WHERE id_variante = p_id_variante
    RETURNING stock_total INTO p_stock_nuevo;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;


-- ── SP 4: Reporte de ventas por período ───────────────────────
CREATE OR REPLACE PROCEDURE sp_reporte_ventas_periodo(
    IN  p_fecha_inicio  DATE,
    IN  p_fecha_fin     DATE,
    OUT p_total_ventas  INT,
    OUT p_total_ingresos NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_fecha_inicio > p_fecha_fin THEN
        RAISE EXCEPTION 'La fecha de inicio no puede ser mayor a la fecha fin'
            USING ERRCODE = 'check_violation';
    END IF;

    SELECT
        COUNT(DISTINCT v.id_venta),
        COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0)
    INTO p_total_ventas, p_total_ingresos
    FROM venta v
    JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    WHERE v.fecha::DATE BETWEEN p_fecha_inicio AND p_fecha_fin;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;


-- ── SP 5: Crear categoría ─────────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_crear_categoria(
    IN  p_nombre        VARCHAR,
    IN  p_descripcion   TEXT,
    OUT p_id_categoria  INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre de la categoría no puede estar vacío'
            USING ERRCODE = 'check_violation';
    END IF;

    INSERT INTO categoria (nombre, descripcion)
    VALUES (TRIM(p_nombre), p_descripcion)
    RETURNING id_categoria INTO p_id_categoria;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Ya existe una categoría con el nombre "%"', p_nombre
            USING ERRCODE = 'unique_violation';
    WHEN OTHERS THEN
        RAISE;
END;
$$;


-- =============================================================
-- PERMISOS DE EJECUCIÓN EN STORED PROCEDURES
-- =============================================================

GRANT EXECUTE ON PROCEDURE sp_registrar_venta     TO rol_admin, rol_vendedor;
GRANT EXECUTE ON PROCEDURE sp_crear_producto       TO rol_admin, rol_inventario;
GRANT EXECUTE ON PROCEDURE sp_actualizar_stock     TO rol_admin, rol_inventario;
GRANT EXECUTE ON PROCEDURE sp_reporte_ventas_periodo TO rol_admin, rol_reportes;
GRANT EXECUTE ON PROCEDURE sp_crear_categoria      TO rol_admin, rol_inventario;
