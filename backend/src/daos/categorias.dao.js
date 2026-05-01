const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(
        'SELECT * FROM categoria ORDER BY id_categoria ASC'
    )
    return result.rows
}

const getById = async(id) => {
    const result = await pool.query(
        'SELECT * FROM categoria WHERE id_categoria = $1', [id]
    )
    return result.rows[0]
}

const create = async({ nombre, descripcion }) => {
    const result = await pool.query(`
    INSERT INTO categoria (nombre, descripcion)
    VALUES ($1, $2) RETURNING *
  `, [nombre, descripcion])
    return result.rows[0]
}

const update = async(id, { nombre, descripcion }) => {
    const result = await pool.query(`
    UPDATE categoria
    SET nombre = $1, descripcion = $2
    WHERE id_categoria = $3 RETURNING *
  `, [nombre, descripcion, id])
    return result.rows[0]
}

const remove = async(id) => {
    const result = await pool.query(
        'DELETE FROM categoria WHERE id_categoria = $1 RETURNING *', [id]
    )
    return result.rows[0]
}

module.exports = { getAll, getById, create, update, remove }