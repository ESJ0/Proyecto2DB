const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(
        'SELECT * FROM proveedor ORDER BY id_proveedor ASC'
    )
    return result.rows
}

const getById = async(id) => {
    const result = await pool.query(
        'SELECT * FROM proveedor WHERE id_proveedor = $1', [id]
    )
    return result.rows[0]
}

const create = async({ nombre, telefono, email }) => {
    const result = await pool.query(`
    INSERT INTO proveedor (nombre, telefono, email)
    VALUES ($1, $2, $3) RETURNING *
  `, [nombre, telefono, email])
    return result.rows[0]
}

const update = async(id, { nombre, telefono, email }) => {
    const result = await pool.query(`
    UPDATE proveedor
    SET nombre = $1, telefono = $2, email = $3
    WHERE id_proveedor = $4 RETURNING *
  `, [nombre, telefono, email, id])
    return result.rows[0]
}

const remove = async(id) => {
    const result = await pool.query(
        'DELETE FROM proveedor WHERE id_proveedor = $1 RETURNING *', [id]
    )
    return result.rows[0]
}

module.exports = { getAll, getById, create, update, remove }