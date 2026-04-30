const dao = require('../daos/proveedores.dao')

const getAll = async(req, res, next) => {
    try {
        const proveedores = await dao.getAll()
        res.json(proveedores)
    } catch (err) {
        next(err)
    }
}

const getById = async(req, res, next) => {
    try {
        const proveedor = await dao.getById(req.params.id)
        if (!proveedor) {
            return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
        }
        res.json(proveedor)
    } catch (err) {
        next(err)
    }
}

const create = async(req, res, next) => {
    try {
        const nuevo = await dao.create(req.body)
        res.status(201).json(nuevo)
    } catch (err) {
        next(err)
    }
}

const update = async(req, res, next) => {
    try {
        const actualizado = await dao.update(req.params.id, req.body)
        if (!actualizado) {
            return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
        }
        res.json(actualizado)
    } catch (err) {
        next(err)
    }
}

const remove = async(req, res, next) => {
    try {
        const eliminado = await dao.remove(req.params.id)
        if (!eliminado) {
            return res.status(404).json({ error: true, message: 'Proveedor no encontrado' })
        }
        res.json({ message: 'Proveedor eliminado correctamente' })
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene productos asociados' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }