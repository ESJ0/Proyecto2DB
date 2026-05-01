const dao = require('../daos/productos.dao')

const getAll = async(req, res, next) => {
    try {
        const productos = await dao.getAll()
        res.json(productos)
    } catch (err) {
        next(err)
    }
}

const getById = async(req, res, next) => {
    try {
        const producto = await dao.getById(req.params.id)
        if (!producto) {
            return res.status(404).json({ error: true, message: 'Producto no encontrado' })
        }
        res.json(producto)
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
            return res.status(400).json({ error: true, message: 'Ya existe un producto con ese SKU' })
        }
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'Categoría o proveedor no existe' })
        }
        next(err)
    }
}

const update = async(req, res, next) => {
    try {
        const actualizado = await dao.update(req.params.id, req.body)
        if (!actualizado) {
            return res.status(404).json({ error: true, message: 'Producto no encontrado' })
        }
        res.json(actualizado)
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: true, message: 'Ya existe un producto con ese SKU' })
        }
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'Categoría o proveedor no existe' })
        }
        next(err)
    }
}

const remove = async(req, res, next) => {
    try {
        const eliminado = await dao.remove(req.params.id)
        if (!eliminado) {
            return res.status(404).json({ error: true, message: 'Producto no encontrado' })
        }
        res.json({ message: 'Producto eliminado correctamente' })
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene variantes asociadas' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }