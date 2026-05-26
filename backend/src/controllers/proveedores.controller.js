const Proveedor = require('../models/proveedor')

// GET /api/proveedores
const getAll = async(req, res, next) => {
    try {
        const proveedores = await Proveedor.findAll({
            order: [
                ['id_proveedor', 'ASC']
            ]
        })
        res.json(proveedores)
    } catch (err) { next(err) }
}

// GET /api/proveedores/:id
const getById = async(req, res, next) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id)
        if (!proveedor) {
            return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
        }
        res.json(proveedor)
    } catch (err) { next(err) }
}

// POST /api/proveedores — Sequelize create
const create = async(req, res, next) => {
    try {
        const { nombre, telefono, email } = req.body
        const nuevo = await Proveedor.create({ nombre, telefono, email })
        res.status(201).json(nuevo)
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: true, message: 'Ya existe un proveedor con ese email' })
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: true, message: err.errors[0].message })
        }
        next(err)
    }
}

// PUT /api/proveedores/:id — Sequelize update
const update = async(req, res, next) => {
    try {
        const { nombre, telefono, email } = req.body
        const proveedor = await Proveedor.findByPk(req.params.id)
        if (!proveedor) {
            return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
        }
        await proveedor.update({ nombre, telefono, email })
        res.json(proveedor)
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: true, message: 'Ya existe un proveedor con ese email' })
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: true, message: err.errors[0].message })
        }
        next(err)
    }
}

// DELETE /api/proveedores/:id — Sequelize destroy
const remove = async(req, res, next) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id)
        if (!proveedor) {
            return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
        }
        await proveedor.destroy()
        res.json({ message: 'Proveedor eliminado correctamente' })
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError' || err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene productos asociados' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }