const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(`
    SELECT
      v.id_venta,
      v.fecha,
      v.metodo_pago,
      c.nombre AS cliente,
      e.nombre AS empleado,
      SUM(dv.cantidad * dv.precio_unitario) AS total
    FROM Venta v
    JOIN Cliente  c ON v.id_cliente  = c.id_cliente
    JOIN Empleado e ON v.id_empleado = e.id_empleado
    JOIN DetalleVenta dv ON v.id_venta = dv.id_venta
    GROUP BY v.id_venta, v.fecha, v.metodo_pago, c.nombre, e.nombre
    ORDER BY v.fecha DESC
  `)
    return result.rows
}

const getById = async(id) => {
    // Trae la venta con su detalle completo
    const venta = await pool.query(`
    SELECT
      v.id_venta,
      v.fecha,
      v.metodo_pago,
      c.nombre AS cliente,
      e.nombre AS empleado
    FROM Venta v
    JOIN Cliente  c ON v.id_cliente  = c.id_cliente
    JOIN Empleado e ON v.id_empleado = e.id_empleado
    WHERE v.id_venta = $1
  `, [id])

    if (!venta.rows[0]) return null

    const detalle = await pool.query(`
    SELECT
      dv.id_variante,
      dv.cantidad,
      dv.precio_unitario,
      dv.cantidad * dv.precio_unitario AS subtotal,
      p.nombre  AS producto,
      pv.talla,
      pv.color
    FROM DetalleVenta dv
    JOIN ProductoVariante pv ON dv.id_variante = pv.id_variante
    JOIN Producto         p  ON pv.id_producto = p.id_producto
    WHERE dv.id_venta = $1
  `, [id])

    return {
        ...venta.rows[0],
        detalle: detalle.rows,
        total: detalle.rows.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
    }
}

// Estos metodos reciben client (transaccion) en lugar de pool
const createVenta = async(client, { id_cliente, id_empleado, metodo_pago }) => {
    const result = await client.query(`
    INSERT INTO Venta (id_cliente, id_empleado, metodo_pago)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [id_cliente, id_empleado, metodo_pago])
    return result.rows[0]
}

const createDetalle = async(client, { id_venta, id_variante, cantidad, precio_unitario }) => {
    const result = await client.query(`
    INSERT INTO DetalleVenta (id_venta, id_variante, cantidad, precio_unitario)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [id_venta, id_variante, cantidad, precio_unitario])
    return result.rows[0]
}

module.exports = { getAll, getById, createVenta, createDetalle }