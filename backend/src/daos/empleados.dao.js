const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(
        'SELECT * FROM empleado ORDER BY id_empleado ASC'
    )
    return result.rows
}

const getById = async(id) => {
    const result = await pool.query(
        'SELECT * FROM empleado WHERE id_empleado = $1', [id]
    )
    return result.rows[0]
}

const create = async({ nombre, telefono, email, fecha_contra }) => {
    const result = await pool.query(`
    INSERT INTO empleado (nombre, telefono, email, fecha_contra)
    VALUES ($1, $2, $3, $4) RETURNING *
  `, [nombre, telefono, email, fecha_contra])
    return result.rows[0]
}

const update = async(id, { nombre, telefono, email, fecha_contra }) => {
    const result = await pool.query(`
    UPDATE empleado
    SET nombre = $1, telefono = $2, email = $3, fecha_contra = $4
    WHERE id_empleado = $5 RETURNING *
  `, [nombre, telefono, email, fecha_contra, id])
    return result.rows[0]
}

const remove = async(id) => {
    const result = await pool.query(
        'DELETE FROM empleado WHERE id_empleado = $1 RETURNING *', [id]
    )
    return result.rows[0]
}

module.exports = { getAll, getById, create, update, remove }