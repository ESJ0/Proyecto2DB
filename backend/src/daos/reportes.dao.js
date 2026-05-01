const pool = require('../database/pool')

const ventasDetalladas = async() => {
    const result = await pool.query(`
    SELECT
      v.id_venta,
      v.fecha,
      v.metodo_pago,
      c.nombre  AS cliente,
      c.telefono AS telefono_cliente,
      e.nombre  AS empleado,
      SUM(dv.cantidad * dv.precio_unitario) AS total
    FROM venta v
    JOIN cliente       c  ON v.id_cliente  = c.id_cliente
    JOIN empleado      e  ON v.id_empleado = e.id_empleado
    JOIN detalle_venta dv ON v.id_venta    = dv.id_venta
    GROUP BY v.id_venta, v.fecha, v.metodo_pago, c.nombre, c.telefono, e.nombre
    ORDER BY v.fecha DESC
  `)
    return result.rows
}

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
    FROM producto p
    JOIN categoria         c  ON p.id_categoria = c.id_categoria
    JOIN proveedor         pr ON p.id_proveedor = pr.id_proveedor
    JOIN producto_variante pv ON p.id_producto  = pv.id_producto
    ORDER BY p.nombre ASC, pv.talla ASC
  `)
    return result.rows
}

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
    FROM detalle_venta dv
    JOIN producto_variante pv ON dv.id_variante = pv.id_variante
    JOIN producto          p  ON pv.id_producto = p.id_producto
    JOIN venta             v  ON dv.id_venta    = v.id_venta
    ORDER BY v.fecha DESC
  `)
    return result.rows
}

const clientesConCompras = async() => {
    const result = await pool.query(`
    SELECT
      c.id_cliente,
      c.nombre,
      c.telefono,
      c.email
    FROM cliente c
    WHERE EXISTS (
      SELECT 1 FROM venta v
      WHERE v.id_cliente = c.id_cliente
    )
    ORDER BY c.nombre ASC
  `)
    return result.rows
}

const productosStockBajoPromedio = async() => {
    const result = await pool.query(`
    SELECT
      p.nombre AS producto,
      p.marca,
      pv.talla,
      pv.color,
      pv.stock_total
    FROM producto_variante pv
    JOIN producto p ON pv.id_producto = p.id_producto
    WHERE pv.stock_total < (
      SELECT AVG(stock_total) FROM producto_variante
    )
    ORDER BY pv.stock_total ASC
  `)
    return result.rows
}

const categoriasMasVendidas = async() => {
    const result = await pool.query(`
    SELECT
      c.nombre          AS categoria,
      COUNT(DISTINCT p.id_producto) AS total_productos,
      SUM(dv.cantidad)  AS unidades_vendidas,
      SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
    FROM categoria c
    JOIN producto          p  ON c.id_categoria = p.id_categoria
    JOIN producto_variante pv ON p.id_producto  = pv.id_producto
    JOIN detalle_venta     dv ON pv.id_variante = dv.id_variante
    GROUP BY c.nombre
    HAVING SUM(dv.cantidad) > 1
    ORDER BY total_ingresos DESC
  `)
    return result.rows
}

const topProductosMes = async() => {
    const result = await pool.query(`
    WITH ventas_mes AS (
      SELECT
        pv.id_producto,
        SUM(dv.cantidad) AS unidades_vendidas,
        SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
      FROM detalle_venta dv
      JOIN producto_variante pv ON dv.id_variante = pv.id_variante
      JOIN venta v ON dv.id_venta = v.id_venta
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
    JOIN producto p ON vm.id_producto = p.id_producto
    ORDER BY vm.unidades_vendidas DESC
    LIMIT 5
  `)
    return result.rows
}

const ventasPorEmpleado = async() => {
    const result = await pool.query(`
    SELECT * FROM vista_ventas_empleado
    ORDER BY total_ingresos DESC
  `)
    return result.rows
}

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