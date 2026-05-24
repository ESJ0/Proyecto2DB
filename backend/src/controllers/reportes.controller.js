const pool = require('../database/pool')

const ventasDetalladas = async(req, res, next) => {
    try {
        const r = await pool.query(`
      SELECT v.id_venta, v.fecha, v.metodo_pago,
             c.nombre AS cliente, c.telefono AS telefono_cliente,
             e.nombre AS empleado,
             SUM(dv.cantidad * dv.precio_unitario) AS total
      FROM venta v
      JOIN cliente       c  ON v.id_cliente  = c.id_cliente
      JOIN empleado      e  ON v.id_empleado = e.id_empleado
      JOIN detalle_venta dv ON v.id_venta    = dv.id_venta
      GROUP BY v.id_venta, v.fecha, v.metodo_pago, c.nombre, c.telefono, e.nombre
      ORDER BY v.fecha DESC
    `)
        res.json(r.rows)
    } catch (err) { next(err) }
}

const inventarioCompleto = async(req, res, next) => {
    try {
        const r = await pool.query(`
      SELECT p.sku, p.nombre AS producto, p.marca, p.precio_actual,
             c.nombre AS categoria, pr.nombre AS proveedor,
             pv.talla, pv.color, pv.stock_total
      FROM producto p
      JOIN categoria         c  ON p.id_categoria = c.id_categoria
      JOIN proveedor         pr ON p.id_proveedor = pr.id_proveedor
      JOIN producto_variante pv ON p.id_producto  = pv.id_producto
      ORDER BY p.nombre ASC, pv.talla ASC
    `)
        res.json(r.rows)
    } catch (err) { next(err) }
}

const detalleVentasProductos = async(req, res, next) => {
    try {
        const r = await pool.query(`
      SELECT v.id_venta, v.fecha, p.nombre AS producto, p.marca,
             pv.talla, pv.color, dv.cantidad, dv.precio_unitario,
             dv.cantidad * dv.precio_unitario AS subtotal
      FROM detalle_venta     dv
      JOIN producto_variante pv ON dv.id_variante = pv.id_variante
      JOIN producto          p  ON pv.id_producto = p.id_producto
      JOIN venta             v  ON dv.id_venta    = v.id_venta
      ORDER BY v.fecha DESC
    `)
        res.json(r.rows)
    } catch (err) { next(err) }
}

const clientesConCompras = async(req, res, next) => {
    try {
        const r = await pool.query(`
      SELECT c.id_cliente, c.nombre, c.telefono, c.email
      FROM cliente c
      WHERE EXISTS (SELECT 1 FROM venta v WHERE v.id_cliente = c.id_cliente)
      ORDER BY c.nombre ASC
    `)
        res.json(r.rows)
    } catch (err) { next(err) }
}

const productosStockBajoPromedio = async(req, res, next) => {
    try {
        const r = await pool.query(`
      SELECT p.nombre AS producto, p.marca, pv.talla, pv.color, pv.stock_total
      FROM producto_variante pv
      JOIN producto p ON pv.id_producto = p.id_producto
      WHERE pv.stock_total < (SELECT AVG(stock_total) FROM producto_variante)
      ORDER BY pv.stock_total ASC
    `)
        res.json(r.rows)
    } catch (err) { next(err) }
}

const categoriasMasVendidas = async(req, res, next) => {
    try {
        const r = await pool.query(`
      SELECT c.nombre AS categoria,
             COUNT(DISTINCT p.id_producto) AS total_productos,
             SUM(dv.cantidad)              AS unidades_vendidas,
             SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
      FROM categoria         c
      JOIN producto          p  ON c.id_categoria = p.id_categoria
      JOIN producto_variante pv ON p.id_producto  = pv.id_producto
      JOIN detalle_venta     dv ON pv.id_variante = dv.id_variante
      GROUP BY c.nombre
      HAVING SUM(dv.cantidad) > 1
      ORDER BY total_ingresos DESC
    `)
        res.json(r.rows)
    } catch (err) { next(err) }
}

const topProductosMes = async(req, res, next) => {
    try {
        const r = await pool.query(`
      WITH ventas_mes AS (
        SELECT pv.id_producto,
               SUM(dv.cantidad) AS unidades_vendidas,
               SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
        FROM detalle_venta dv
        JOIN producto_variante pv ON dv.id_variante = pv.id_variante
        JOIN venta v              ON dv.id_venta    = v.id_venta
        WHERE DATE_TRUNC('month', v.fecha) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY pv.id_producto
      )
      SELECT p.nombre AS producto, p.marca, p.precio_actual,
             vm.unidades_vendidas, vm.total_ingresos
      FROM ventas_mes vm
      JOIN producto p ON vm.id_producto = p.id_producto
      ORDER BY vm.unidades_vendidas DESC
      LIMIT 5
    `)
        res.json(r.rows)
    } catch (err) { next(err) }
}

const ventasPorEmpleado = async(req, res, next) => {
    try {
        const r = await pool.query('SELECT * FROM vista_ventas_empleado ORDER BY total_ingresos DESC')
        res.json(r.rows)
    } catch (err) { next(err) }
}

const productosMasVendidos = async(req, res, next) => {
    try {
        const r = await pool.query('SELECT * FROM vista_productos_mas_vendidos ORDER BY unidades_vendidas DESC')
        res.json(r.rows)
    } catch (err) { next(err) }
}

// GET /api/reportes/ventas-periodo?inicio=2025-01-01&fin=2025-12-31
// Usa SP sp_reporte_ventas_periodo (stored procedure 4)
const ventasPeriodo = async(req, res, next) => {
    try {
        const { inicio, fin } = req.query

        if (!inicio || !fin) {
            return res.status(400).json({ error: true, message: 'Parámetros inicio y fin requeridos (YYYY-MM-DD)' })
        }

        const result = await pool.query(
            'CALL sp_reporte_ventas_periodo($1, $2, NULL, NULL)', [inicio, fin]
        )

        res.json({
            fecha_inicio: inicio,
            fecha_fin: fin,
            total_ventas: result.rows[0]?.p_total_ventas,
            total_ingresos: result.rows[0]?.p_total_ingresos
        })
    } catch (err) {
        if (err.message) {
            return res.status(400).json({ error: true, message: err.message })
        }
        next(err)
    }
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
    productosMasVendidos,
    ventasPeriodo
}