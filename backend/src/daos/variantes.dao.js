const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(`
    SELECT
      pv.id_variante,
      pv.talla,
      pv.color,
      pv.peso,
      pv.alto,
      pv.ancho,
      pv.largo,
      pv.stock_total,
      p.nombre AS producto,
      p.sku,
      p.precio_actual
    FROM ProductoVariante pv
    JOIN Producto p ON pv.id_producto = p.id_producto
    ORDER BY pv.id_variante ASC
  `)
    return result.rows
}

const getById = async(id) => {
    const result = await pool.query(`
    SELECT
      pv.id_variante,
      pv.talla,
      pv.color,
      pv.peso,
      pv.alto,
      pv.ancho,
      pv.largo,
      pv.stock_total,
      p.nombre AS producto,
      p.sku,
      p.precio_actual
    FROM ProductoVariante pv
    JOIN Producto p ON pv.id_producto = p.id_producto
    WHERE pv.id_variante = $1
  `, [id])
    return result.rows[0]
}

const getByProducto = async(id_producto) => {
    const result = await pool.query(`
    SELECT *
    FROM ProductoVariante
    WHERE id_producto = $1
    ORDER BY talla ASC
  `, [id_producto])
    return result.rows
}

const create = async({ id_producto, talla, color, peso, alto, ancho, largo, stock_total }) => {
    const result = await pool.query(`
    INSERT INTO ProductoVariante
      (id_producto, talla, color, peso, alto, ancho, largo, stock_total)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [id_producto, talla, color, peso, alto, ancho, largo, stock_total])
    return result.rows[0]
}

const update = async(id, { id_producto, talla, color, peso, alto, ancho, largo, stock_total }) => {
    const result = await pool.query(`
    UPDATE ProductoVariante
    SET
      id_producto = $1,
      talla       = $2,
      color       = $3,
      peso        = $4,
      alto        = $5,
      ancho       = $6,
      largo       = $7,
      stock_total = $8
    WHERE id_variante = $9
    RETURNING *
  `, [id_producto, talla, color, peso, alto, ancho, largo, stock_total, id])
    return result.rows[0]
}

const remove = async(id) => {
    const result = await pool.query(
        'DELETE FROM ProductoVariante WHERE id_variante = $1 RETURNING *', [id]
    )
    return result.rows[0]
}

// Metodo que usa el service de ventas para verificar y descontar stock
const descontarStock = async(client, id_variante, cantidad) => {
    const result = await client.query(`
    UPDATE ProductoVariante
    SET stock_total = stock_total - $1
    WHERE id_variante = $2
    AND stock_total >= $1
    RETURNING *
  `, [cantidad, id_variante])
    return result.rows[0]
}

module.exports = { getAll, getById, getByProducto, create, update, remove, descontarStock }