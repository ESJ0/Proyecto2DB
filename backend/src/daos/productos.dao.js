const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre,
      p.sku,
      p.marca,
      p.descripcion,
      p.genero,
      p.precio_actual,
      p.imagen,
      c.nombre AS categoria,
      pr.nombre AS proveedor
    FROM Producto p
    JOIN Categoria c   ON p.id_categoria = c.id_categoria
    JOIN Proveedor pr  ON p.id_proveedor = pr.id_proveedor
    ORDER BY p.id_producto ASC
  `)
    return result.rows
}

const getById = async(id) => {
    const result = await pool.query(`
    SELECT 
      p.id_producto,
      p.nombre,
      p.sku,
      p.marca,
      p.descripcion,
      p.genero,
      p.precio_actual,
      p.imagen,
      c.nombre AS categoria,
      pr.nombre AS proveedor
    FROM Producto p
    JOIN Categoria c   ON p.id_categoria = c.id_categoria
    JOIN Proveedor pr  ON p.id_proveedor = pr.id_proveedor
    WHERE p.id_producto = $1
  `, [id])
    return result.rows[0]
}

const create = async({ id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen }) => {
    const result = await pool.query(`
    INSERT INTO Producto 
      (id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen])
    return result.rows[0]
}

const update = async(id, { id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen }) => {
    const result = await pool.query(`
    UPDATE Producto
    SET 
      id_categoria  = $1,
      id_proveedor  = $2,
      nombre        = $3,
      sku           = $4,
      marca         = $5,
      descripcion   = $6,
      genero        = $7,
      precio_actual = $8,
      imagen        = $9
    WHERE id_producto = $10
    RETURNING *
  `, [id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen, id])
    return result.rows[0]
}

const remove = async(id) => {
    const result = await pool.query(
        'DELETE FROM Producto WHERE id_producto = $1 RETURNING *', [id]
    )
    return result.rows[0]
}

module.exports = { getAll, getById, create, update, remove }