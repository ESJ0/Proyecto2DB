const pool = require('../database/pool')

// ============================================================
// JOIN 1 — Ventas completas con cliente, empleado y total
// ============================================================
const ventasDetalladas = async() => {
    const result = await pool.query(`
    SELECT
      v.id_venta,
      v.fecha,
      v.metodo_pago,
      c.nombre  AS cliente,
      c.telefono AS telefono_cliente,
      e.nombre  AS empleado,
      e.cargo,
      SUM(dv.cantidad * dv.precio_unitario) AS total
    FROM Venta v
    JOIN Cliente      c  ON v.id_cliente  = c.id_cliente
    JOIN Empleado     e  ON v.id_empleado = e.id_empleado
    JOIN DetalleVenta dv ON v.id_venta    = dv.id_venta
    GROUP BY
      v.id_venta, v.fecha, v.metodo_pago,
      c.nombre, c.telefono,
      e.nombre, e.cargo
    ORDER BY v.fecha DESC
  `)
    return result.rows
}

// ============================================================
// JOIN 2 — Inventario completo con categoria y proveedor
// ============================================================
const inventarioCompleto = async() => {
    const result = await pool.query(`
    SELECT
      p.sku,
      p.nombre      AS producto,
      p.marca,
      p.precio_actual,
      c.nombre      AS categoria,
      pr.nombre     AS proveedor,
      pv.talla,
      pv.color,
      pv.stock_total
    FROM Producto p
    JOIN Categoria        c  ON p.id_categoria = c.id_categoria
    JOIN Proveedor        pr ON p.id_proveedor = pr.id_proveedor
    JOIN ProductoVariante pv ON p.id_producto  = pv.id_producto
    ORDER BY p.nombre ASC, pv.talla ASC
  `)
    return result.rows
}

// ============================================================
// JOIN 3 — Detalle de ventas con producto y variante
// ============================================================
const detalleVentasProductos = async() => {
    const result = await pool.query(`
    SELECT
      v.id_venta,
      v.fecha,
      p.nombre      AS producto,
      p.marca,
      pv.talla,
      pv.color,
      dv.cantidad,
      dv.precio_unitario,
      dv.cantidad * dv.precio_unitario AS subtotal
    FROM DetalleVenta dv
    JOIN ProductoVariante pv ON dv.id_variante  = pv.id_variante
    JOIN Producto         p  ON pv.id_producto  = p.id_producto
    JOIN Venta            v  ON dv.id_venta     = v.id_venta
    ORDER BY v.fecha DESC
  `)
    return result.rows
}

// ============================================================
// SUBQUERY 1 — Clientes que han realizado al menos una compra
// usando EXISTS
// ============================================================
const clientesConCompras = async() => {
    const result = await pool.query(`
    SELECT
      c.id_cliente,
      c.nombre,
      c.telefono,
      c.email
    FROM Cliente c
    WHERE EXISTS (
      SELECT 1
      FROM Venta v
      WHERE v.id_cliente = c.id_cliente
    )
    ORDER BY c.nombre ASC
  `)
    return result.rows
}

// ============================================================
// SUBQUERY 2 — Productos con stock por debajo del promedio
// usando subquery en WHERE
// ============================================================
const productosStockBajoPromedio = async() => {
    const result = await pool.query(`
    SELECT
      p.nombre AS producto,
      p.marca,
      pv.talla,
      pv.color,
      pv.stock_total
    FROM ProductoVariante pv
    JOIN Producto p ON pv.id_producto = p.id_producto
    WHERE pv.stock_total < (
      SELECT AVG(stock_total)
      FROM ProductoVariante
    )
    ORDER BY pv.stock_total ASC
  `)
    return result.rows
}

// ============================================================
// GROUP BY + HAVING — Categorias con mas de 1 producto vendido
// ============================================================
const categoriasMasVendidas = async() => {
    const result = await pool.query(`
    SELECT
      c.nombre          AS categoria,
      COUNT(DISTINCT p.id_producto) AS total_productos,
      SUM(dv.cantidad)  AS unidades_vendidas,
      SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
    FROM Categoria c
    JOIN Producto         p  ON c.id_categoria = p.id_categoria
    JOIN ProductoVariante pv ON p.id_producto  = pv.id_producto
    JOIN DetalleVenta     dv ON pv.id_variante = dv.id_variante
    GROUP BY c.nombre
    HAVING SUM(dv.cantidad) > 1
    ORDER BY total_ingresos DESC
  `)
    return result.rows
}

// ============================================================
// CTE — Top 5 productos mas vendidos del mes actual
// ============================================================
const topProductosMes = async() => {
    const result = await pool.query(`
    WITH ventas_mes AS (
      SELECT
        pv.id_producto,
        SUM(dv.cantidad) AS unidades_vendidas,
        SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
      FROM DetalleVenta dv
      JOIN ProductoVariante pv ON dv.id_variante = pv.id_variante
      JOIN Venta v ON dv.id_venta = v.id_venta
      WHERE DATE_TRUNC('month', v.fecha) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY pv.id_producto
    )
    SELECT
      p.nombre      AS producto,
      p.marca,
      p.precio_actual,
      vm.unidades_vendidas,
      vm.total_ingresos
    FROM ventas_mes vm
    JOIN Producto p ON vm.id_producto = p.id_producto
    ORDER BY vm.unidades_vendidas DESC
    LIMIT 5
  `)
    return result.rows
}

// ============================================================
// VISTA — Ventas por empleado (usa vista del schema)
// ============================================================
const ventasPorEmpleado = async() => {
    const result = await pool.query(`
    SELECT * FROM vista_ventas_empleado
    ORDER BY total_ingresos DESC
  `)
    return result.rows
}

// ============================================================
// VISTA — Productos mas vendidos (usa vista del schema)
// ============================================================
const productosMasVendidos = async() => {
    const result = await pool.query(`
    SELECT * FROM vista_productos_mas_vendidos
    ORDER BY unidades_vendidas DESC
  `)
    return result.rows
}

module.exports = {
    ventasDetalladas,
    inventarioCompleto,
    detalleVentasProductos,
    clientesConCompras,
    productosStockBajoPromedio,
    categoriasMasVendidas,
    topProductosMes,
    ventasPorEmpleado,
    productosMasVendidos
}