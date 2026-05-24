const pool = require('../database/pool')

const getAll = async(req, res, next) => {
    try {
        const result = await pool.query(`
      SELECT pv.id_variante, pv.id_producto, pv.talla, pv.color,
             pv.peso, pv.alto, pv.ancho, pv.largo, pv.stock_total,
             p.nombre AS producto, p.sku, p.precio_actual
      FROM producto_variante pv
      JOIN producto p ON pv.id_producto = p.id_producto
      ORDER BY pv.id_variante ASC
    `)
        res.json(result.rows)
    } catch (err) { next(err) }
}

const getById = async(req, res, next) => {
    try {
        const result = await pool.query(`
      SELECT pv.id_variante, pv.id_producto, pv.talla, pv.color,
             pv.peso, pv.alto, pv.ancho, pv.largo, pv.stock_total,
             p.nombre AS producto, p.sku, p.precio_actual
      FROM producto_variante pv
      JOIN producto p ON pv.id_producto = p.id_producto
      WHERE pv.id_variante = $1
    `, [req.params.id])

        if (!result.rows[0]) {
            return res.status(404).json({ error: true, message: 'Variante no encontrada' })
        }
        res.json(result.rows[0])
    } catch (err) { next(err) }
}

const getByProducto = async(req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM producto_variante WHERE id_producto = $1 ORDER BY talla ASC', [req.params.id_producto]
        )
        res.json(result.rows)
    } catch (err) { next(err) }
}

const create = async(req, res, next) => {
    try {
        const { id_producto, talla, color, peso, alto, ancho, largo, stock_total } = req.body
        const result = await pool.query(`
      INSERT INTO producto_variante
        (id_producto, talla, color, peso, alto, ancho, largo, stock_total)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [id_producto, talla, color, peso, alto, ancho, largo, stock_total || 0])
        res.status(201).json(result.rows[0])
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'El producto no existe' })
        }
        next(err)
    }
}

const update = async(req, res, next) => {
    try {
        const { id_producto, talla, color, peso, alto, ancho, largo, stock_total } = req.body
        const result = await pool.query(`
      UPDATE producto_variante
      SET id_producto=$1, talla=$2, color=$3, peso=$4,
          alto=$5, ancho=$6, largo=$7, stock_total=$8
      WHERE id_variante=$9 RETURNING *
    `, [id_producto, talla, color, peso, alto, ancho, largo, stock_total, req.params.id])

        if (!result.rows[0]) {
            return res.status(404).json({ error: true, message: 'Variante no encontrada' })
        }
        res.json(result.rows[0])
    } catch (err) { next(err) }
}

const remove = async(req, res, next) => {
    try {
        const result = await pool.query(
            'DELETE FROM producto_variante WHERE id_variante=$1 RETURNING *', [req.params.id]
        )
        if (!result.rows[0]) {
            return res.status(404).json({ error: true, message: 'Variante no encontrada' })
        }
        res.json({ message: 'Variante eliminada correctamente' })
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene ventas asociadas' })
        }
        next(err)
    }
}

// PATCH /api/variantes/:id/stock — usa SP sp_actualizar_stock (stored procedure 3)
const actualizarStock = async(req, res, next) => {
    try {
        const { cantidad, motivo } = req.body

        const result = await pool.query(
            'CALL sp_actualizar_stock($1, $2, $3, NULL)', [req.params.id, cantidad, motivo || 'ajuste']
        )

        res.json({
            id_variante: parseInt(req.params.id),
            stock_nuevo: result.rows[0] ? result.rows[0].p_stock_nuevo : null,
            message: 'Stock actualizado correctamente'
        })
    } catch (err) {
        if (err.message) {
            return res.status(400).json({ error: true, message: err.message })
        }
        next(err)
    }
}

module.exports = { getAll, getById, getByProducto, create, update, remove, actualizarStock }
    