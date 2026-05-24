const pool = require('../database/pool')

const getAll = async(req, res, next) => {
    try {
        const result = await pool.query(`
      SELECT
        v.id_venta, v.fecha, v.metodo_pago,
        c.nombre AS cliente,
        e.nombre AS empleado,
        SUM(dv.cantidad * dv.precio_unitario) AS total
      FROM venta v
      JOIN cliente       c  ON v.id_cliente  = c.id_cliente
      JOIN empleado      e  ON v.id_empleado = e.id_empleado
      JOIN detalle_venta dv ON v.id_venta    = dv.id_venta
      GROUP BY v.id_venta, v.fecha, v.metodo_pago, c.nombre, e.nombre
      ORDER BY v.fecha DESC
    `)
        res.json(result.rows)
    } catch (err) { next(err) }
}

const getById = async(req, res, next) => {
    try {
        const venta = await pool.query(`
      SELECT v.id_venta, v.fecha, v.metodo_pago,
             c.nombre AS cliente, e.nombre AS empleado
      FROM venta v
      JOIN cliente  c ON v.id_cliente  = c.id_cliente
      JOIN empleado e ON v.id_empleado = e.id_empleado
      WHERE v.id_venta = $1
    `, [req.params.id])

        if (!venta.rows[0]) {
            return res.status(404).json({ error: true, message: 'Venta no encontrada' })
        }

        const detalle = await pool.query(`
      SELECT dv.id_variante, dv.cantidad, dv.precio_unitario,
             dv.cantidad * dv.precio_unitario AS subtotal,
             p.nombre AS producto, pv.talla, pv.color
      FROM detalle_venta     dv
      JOIN producto_variante pv ON dv.id_variante = pv.id_variante
      JOIN producto          p  ON pv.id_producto = p.id_producto
      WHERE dv.id_venta = $1
    `, [req.params.id])

        res.json({
            ...venta.rows[0],
            detalle: detalle.rows,
            total: detalle.rows.reduce((acc, r) => acc + parseFloat(r.subtotal), 0)
        })
    } catch (err) { next(err) }
}

// POST /api/ventas — llama al SP sp_registrar_venta 
const create = async(req, res, next) => {
    try {
        const { id_cliente, id_empleado, metodo_pago, items } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: true, message: 'La venta debe tener al menos un producto' })
        }

        // Llamada al stored procedure — el SP maneja la transacción internamente
        const result = await pool.query(
            'CALL sp_registrar_venta($1, $2, $3, $4, NULL, NULL)', [id_cliente, id_empleado, metodo_pago, JSON.stringify(items)]
        )

        const { p_id_venta, p_total } = result.rows[0]

        res.status(201).json({
            id_venta: p_id_venta,
            total: p_total,
            message: 'Venta registrada correctamente'
        })
    } catch (err) {
        // Errores del SP (stock insuficiente, variante no encontrada, etc.)
        if (err.message) {
            return res.status(400).json({ error: true, message: err.message })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create }