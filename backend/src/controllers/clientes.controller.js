const Cliente = require('../models/Cliente')

// GET /api/clientes
const getAll = async(req, res, next) => {
    try {
        const clientes = await Cliente.findAll({ order: [
                ['id_cliente', 'ASC']
            ] })
        res.json(clientes)
    } catch (err) { next(err) }
}

// GET /api/clientes/:id
const getById = async(req, res, next) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) {
            return res.status(404).json({ error: true, message: 'Cliente no encontrado' })
        }
        res.json(cliente)
    } catch (err) { next(err) }
}

// POST /api/clientes — Sequelize create
const create = async(req, res, next) => {
    try {
        const { nombre, telefono, email } = req.body
        const nuevo = await Cliente.create({ nombre, telefono, email })
        res.status(201).json(nuevo)
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: true, message: 'Ya existe un cliente con ese email' })
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: true, message: err.errors[0].message })
        }
        next(err)
    }
}

// PUT /api/clientes/:id — Sequelize update
const update = async(req, res, next) => {
    try {
        const { nombre, telefono, email } = req.body
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) {
            return res.status(404).json({ error: true, message: 'Cliente no encontrado' })
        }
        await cliente.update({ nombre, telefono, email })
        res.json(cliente)
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: true, message: 'Ya existe un cliente con ese email' })
        }
        next(err)
    }
}

// DELETE /api/clientes/:id — Sequelize destroy
const remove = async(req, res, next) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id)
        if (!cliente) {
            return res.status(404).json({ error: true, message: 'Cliente no encontrado' })
        }
        await cliente.destroy()
        res.json({ message: 'Cliente eliminado correctamente' })
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError' || err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene ventas asociadas' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }