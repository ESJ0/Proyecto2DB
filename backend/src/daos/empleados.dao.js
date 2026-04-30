const pool = require('../database/pool')

const getAll = async() => {
    const result = await pool.query(
        'SELECT * FROM Empleado ORDER BY id_empleado ASC'
    )
    return result.rows
}

const getById = async(id) => {
    const result = await pool.query(
        'SELECT * FROM Empleado WHERE id_empleado = $1', [id]
    )
    return result.rows[0]
}

const create = async({ nombre, telefono, email, cargo, fecha_contra }) => {
    const result = await pool.query(`
    INSERT INTO Empleado (nombre, telefono, email, cargo, fecha_contra)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `, [nombre, telefono, email, cargo, fecha_contra])
    return result.rows[0]
}

const update = async(id, { nombre, telefono, email, cargo, fecha_contra }) => {
    const result = await pool.query(`
    UPDATE Empleado
    SET nombre = $1, telefono = $2, email = $3, cargo = $4, fecha_contra = $5
    WHERE id_empleado = $6 RETURNING *
  `, [nombre, telefono, email, cargo, fecha_contra, id])
    return result.rows[0]
}

const remove = async(id) => {
    const result = await pool.query(
        'DELETE FROM Empleado WHERE id_empleado = $1 RETURNING *', [id]
    )
    return result.rows[0]
}

module.exports = { getAll, getById, create, update, remove }