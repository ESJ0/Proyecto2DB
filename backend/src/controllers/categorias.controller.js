const dao = require('../daos/categorias.dao')

const getAll = async(req, res, next) => {
    try {
        const categorias = await dao.getAll()
        res.json(categorias)
    } catch (err) {
        next(err)
    }
}

const getById = async(req, res, next) => {
    try {
        const categoria = await dao.getById(req.params.id)
        if (!categoria) {
            return res.status(404).json({ error: true, message: 'Categoría no encontrada' })
        }
        res.json(categoria)
    } catch (err) {
        next(err)
    }
}

const create = async(req, res, next) => {
    try {
        const nueva = await dao.create(req.body)
        res.status(201).json(nueva)
    } catch (err) {
        // Captura violación de UNIQUE en nombre
        if (err.code === '23505') {
            return res.status(400).json({ error: true, message: 'Ya existe una categoría con ese nombre' })
        }
        next(err)
    }
}

const update = async(req, res, next) => {
    try {
        const actualizada = await dao.update(req.params.id, req.body)
        if (!actualizada) {
            return res.status(404).json({ error: true, message: 'Categoría no encontrada' })
        }
        res.json(actualizada)
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: true, message: 'Ya existe una categoría con ese nombre' })
        }
        next(err)
    }
}

const remove = async(req, res, next) => {
    try {
        const eliminada = await dao.remove(req.params.id)
        if (!eliminada) {
            return res.status(404).json({ error: true, message: 'Categoría no encontrada' })
        }
        res.json({ message: 'Categoría eliminada correctamente' })
    } catch (err) {
        // Captura violación de FK (ON DELETE RESTRICT)
        if (err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene productos asociados' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }