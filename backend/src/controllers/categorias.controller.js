const Categoria = require('../models/categoria')
const pool = require('../database/pool')

// GET /api/categorias — todos los roles con acceso
const getAll = async(req, res, next) => {
    try {
        const categorias = await Categoria.findAll({ order: [
                ['id_categoria', 'ASC']
            ] })
        res.json(categorias)
    } catch (err) { next(err) }
}

// GET /api/categorias/:id
const getById = async(req, res, next) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) {
            return res.status(404).json({ error: true, message: 'Categoría no encontrada' })
        }
        res.json(categoria)
    } catch (err) { next(err) }
}

// POST /api/categorias — usa SP sp_crear_categoria (stored procedure)
const create = async(req, res, next) => {
    try {
        const { nombre, descripcion } = req.body

        // Invoca el stored procedure desde el backend
        const result = await pool.query(
            'CALL sp_crear_categoria($1, $2, NULL)', [nombre, descripcion || null]
        )

        // El SP retorna p_id_categoria en el primer row
        const id = result.rows[0]?.p_id_categoria
        const nueva = await Categoria.findByPk(id)

        res.status(201).json(nueva)
    } catch (err) {
        if (err.message?.includes('unique_violation') || err.code === '23505') {
            return res.status(400).json({ error: true, message: 'Ya existe una categoría con ese nombre' })
        }
        next(err)
    }
}

// PUT /api/categorias/:id — Sequelize update
const update = async(req, res, next) => {
    try {
        const { nombre, descripcion } = req.body
        const categoria = await Categoria.findByPk(req.params.id)

        if (!categoria) {
            return res.status(404).json({ error: true, message: 'Categoría no encontrada' })
        }

        await categoria.update({ nombre, descripcion })
        res.json(categoria)
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: true, message: 'Ya existe una categoría con ese nombre' })
        }
        next(err)
    }
}

// DELETE /api/categorias/:id — Sequelize destroy
const remove = async(req, res, next) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        if (!categoria) {
            return res.status(404).json({ error: true, message: 'Categoría no encontrada' })
        }
        await categoria.destroy()
        res.json({ message: 'Categoría eliminada correctamente' })
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError' || err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene productos asociados' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }
