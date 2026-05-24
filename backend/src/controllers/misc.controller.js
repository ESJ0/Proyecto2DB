const pool = require('../database/pool')

// ── PROVEEDORES ──────────────────────────────────────────────

const proveedores = {
  getAll: async (req, res, next) => {
    try {
      const r = await pool.query('SELECT * FROM proveedor ORDER BY id_proveedor ASC')
      res.json(r.rows)
    } catch (err) { next(err) }
  },

  getById: async (req, res, next) => {
    try {
      const r = await pool.query('SELECT * FROM proveedor WHERE id_proveedor=$1', [req.params.id])
      if (!r.rows[0]) return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
      res.json(r.rows[0])
    } catch (err) { next(err) }
  },

  create: async (req, res, next) => {
    try {
      const { nombre, telefono, email } = req.body
      const r = await pool.query(
        'INSERT INTO proveedor (nombre,telefono,email) VALUES ($1,$2,$3) RETURNING *',
        [nombre, telefono, email]
      )
      res.status(201).json(r.rows[0])
    } catch (err) { next(err) }
  },

  update: async (req, res, next) => {
    try {
      const { nombre, telefono, email } = req.body
      const r = await pool.query(
        'UPDATE proveedor SET nombre=$1,telefono=$2,email=$3 WHERE id_proveedor=$4 RETURNING *',
        [nombre, telefono, email, req.params.id]
      )
      if (!r.rows[0]) return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
      res.json(r.rows[0])
    } catch (err) { next(err) }
  },

  remove: async (req, res, next) => {
    try {
      const r = await pool.query('DELETE FROM proveedor WHERE id_proveedor=$1 RETURNING *', [req.params.id])
      if (!r.rows[0]) return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
      res.json({ message: 'Proveedor eliminado correctamente' })
    } catch (err) {
      if (err.code === '23503') return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene productos asociados' })
      next(err)
    }
  }
}

// ── EMPLEADOS ────────────────────────────────────────────────

const empleados = {
  getAll: async (req, res, next) => {
    try {
      const r = await pool.query('SELECT * FROM empleado ORDER BY id_empleado ASC')
      res.json(r.rows)
    } catch (err) { next(err) }
  },

  getById: async (req, res, next) => {
    try {
      const r = await pool.query('SELECT * FROM empleado WHERE id_empleado=$1', [req.params.id])
      if (!r.rows[0]) return res.status(404).json({ error: true, message: 'Empleado no encontrado' })
      res.json(r.rows[0])
    } catch (err) { next(err) }
  },

  create: async (req, res, next) => {
    try {
      const { nombre, telefono, email, fecha_contra } = req.body
      const r = await pool.query(
        'INSERT INTO empleado (nombre,telefono,email,fecha_contra) VALUES ($1,$2,$3,$4) RETURNING *',
        [nombre, telefono, email, fecha_contra]
      )
      res.status(201).json(r.rows[0])
    } catch (err) {
      if (err.code === '23505') return res.status(400).json({ error: true, message: 'Ya existe un empleado con ese email' })
      next(err)
    }
  },

  update: async (req, res, next) => {
    try {
      const { nombre, telefono, email, fecha_contra } = req.body
      const r = await pool.query(
        'UPDATE empleado SET nombre=$1,telefono=$2,email=$3,fecha_contra=$4 WHERE id_empleado=$5 RETURNING *',
        [nombre, telefono, email, fecha_contra, req.params.id]
      )
      if (!r.rows[0]) return res.status(404).json({ error: true, message: 'Empleado no encontrado' })
      res.json(r.rows[0])
    } catch (err) {
      if (err.code === '23505') return res.status(400).json({ error: true, message: 'Ya existe un empleado con ese email' })
      next(err)
    }
  },

  remove: async (req, res, next) => {
    try {
      const r = await pool.query('DELETE FROM empleado WHERE id_empleado=$1 RETURNING *', [req.params.id])
      if (!r.rows[0]) return res.status(404).json({ error: true, message: 'Empleado no encontrado' })
      res.json({ message: 'Empleado eliminado correctamente' })
    } catch (err) {
      if (err.code === '23503') return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene ventas asociadas' })
      next(err)
    }
  }
}

module.exports = { proveedores, empleados }