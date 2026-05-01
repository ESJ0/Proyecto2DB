const dao = require('../daos/clientes.dao')

const getAll = async(req, res, next) => {
    try {
        const clientes = await dao.getAll()
        res.json(clientes)
    } catch (err) {
        next(err)
    }
}

const getById = async(req, res, next) => {
    try {
        const cliente = await dao.getById(req.params.id)
        if (!cliente) {
            return res.status(404).json({ error: true, message: 'Cliente no encontrado' })
        }
        res.json(cliente)
    } catch (err) {
        next(err)
    }
}

const create = async(req, res, next) => {
    try {
        const nuevo = await dao.create(req.body)
        res.status(201).json(nuevo)
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: true, message: 'Ya existe un cliente con ese email' })
        }
        next(err)
    }
}

const update = async(req, res, next) => {
    try {
        const actualizado = await dao.update(req.params.id, req.body)
        if (!actualizado) {
            return res.status(404).json({ error: true, message: 'Cliente no encontrado' })
        }
        res.json(actualizado)
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: true, message: 'Ya existe un cliente con ese email' })
        }
        next(err)
    }
}

const remove = async(req, res, next) => {
    try {
        const eliminado = await dao.remove(req.params.id)
        if (!eliminado) {
            return res.status(404).json({ error: true, message: 'Cliente no encontrado' })
        }
        res.json({ message: 'Cliente eliminado correctamente' })
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene ventas asociadas' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }