const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(
        'SELECT * FROM cliente ORDER BY id_cliente ASC'
    )
    return result.rows
}

const getById = async(id) => {
    const result = await pool.query(
        'SELECT * FROM cliente WHERE id_cliente = $1', [id]
    )
    return result.rows[0]
}

const create = async({ nombre, telefono, email }) => {
    const result = await pool.query(`
    INSERT INTO cliente (nombre, telefono, email)
    VALUES ($1, $2, $3) RETURNING *
  `, [nombre, telefono, email])
    return result.rows[0]
}

const update = async(id, { nombre, telefono, email }) => {
    const result = await pool.query(`
    UPDATE cliente
    SET nombre = $1, telefono = $2, email = $3
    WHERE id_cliente = $4 RETURNING *
  `, [nombre, telefono, email, id])
    return result.rows[0]
}

const remove = async(id) => {
    const result = await pool.query(
        'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *', [id]
    )
    return result.rows[0]
}

module.exports = { getAll, getById, create, update, remove }