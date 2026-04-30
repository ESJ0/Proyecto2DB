const dao = require('../daos/variantes.dao')

const getAll = async(req, res, next) => {
    try {
        const variantes = await dao.getAll()
        res.json(variantes)
    } catch (err) {
        next(err)
    }
}

const getById = async(req, res, next) => {
    try {
        const variante = await dao.getById(req.params.id)
        if (!variante) {
            return res.status(404).json({ error: true, message: 'Variante no encontrada' })
        }
        res.json(variante)
    } catch (err) {
        next(err)
    }
}

const getByProducto = async(req, res, next) => {
    try {
        const variantes = await dao.getByProducto(req.params.id_producto)
        res.json(variantes)
    } catch (err) {
        next(err)
    }
}

const create = async(req, res, next) => {
    try {
        const nueva = await dao.create(req.body)
        res.status(201).json(nueva)
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'El producto no existe' })
        }
        next(err)
    }
}

const update = async(req, res, next) => {
    try {
        const actualizada = await dao.update(req.params.id, req.body)
        if (!actualizada) {
            return res.status(404).json({ error: true, message: 'Variante no encontrada' })
        }
        res.json(actualizada)
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'El producto no existe' })
        }
        next(err)
    }
}

const remove = async(req, res, next) => {
    try {
        const eliminada = await dao.remove(req.params.id)
        if (!eliminada) {
            return res.status(404).json({ error: true, message: 'Variante no encontrada' })
        }
        res.json({ message: 'Variante eliminada correctamente' })
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene ventas asociadas' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, getByProducto, create, update, remove }