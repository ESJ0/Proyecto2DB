const Producto = require('../models/producto')
const pool = require('../database/pool')

// GET /api/productos — JOIN con SQL directo (Sequelize no maneja bien JOINs sin associations)
const getAll = async(req, res, next) => {
    try {
        const result = await pool.query(`
      SELECT
        p.id_producto, p.nombre, p.sku, p.marca, p.descripcion,
        p.genero, p.precio_actual, p.imagen,
        p.id_categoria, p.id_proveedor,
        c.nombre  AS categoria,
        pr.nombre AS proveedor
      FROM producto p
      JOIN categoria  c  ON p.id_categoria = c.id_categoria
      JOIN proveedor  pr ON p.id_proveedor = pr.id_proveedor
      ORDER BY p.id_producto ASC
    `)
        res.json(result.rows)
    } catch (err) { next(err) }
}

// GET /api/productos/:id
const getById = async(req, res, next) => {
    try {
        const result = await pool.query(`
      SELECT
        p.id_producto, p.nombre, p.sku, p.marca, p.descripcion,
        p.genero, p.precio_actual, p.imagen,
        p.id_categoria, p.id_proveedor,
        c.nombre  AS categoria,
        pr.nombre AS proveedor
      FROM producto p
      JOIN categoria  c  ON p.id_categoria = c.id_categoria
      JOIN proveedor  pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_producto = $1
    `, [req.params.id])

        if (!result.rows[0]) {
            return res.status(404).json({ error: true, message: 'Producto no encontrado' })
        }
        res.json(result.rows[0])
    } catch (err) { next(err) }
}

// POST /api/productos — usa SP sp_crear_producto (stored procedure 2)
const create = async(req, res, next) => {
    try {
        const {
            id_categoria,
            id_proveedor,
            nombre,
            sku,
            marca,
            descripcion,
            genero,
            precio_actual,
            imagen
        } = req.body

        const result = await pool.query(
            'CALL sp_crear_producto($1,$2,$3,$4,$5,$6,$7,$8,$9,NULL)', [id_categoria, id_proveedor, nombre, sku, marca, descripcion, genero, precio_actual, imagen]
        )

        const id = result.rows[0]?.p_id_producto
        const nuevo = await Producto.findByPk(id)
        res.status(201).json(nuevo)
    } catch (err) {
        if (err.message?.includes('unique_violation') || err.code === '23505') {
            return res.status(400).json({ error: true, message: 'Ya existe un producto con ese SKU' })
        }
        if (err.message?.includes('foreign_key_violation') || err.code === '23503') {
            return res.status(400).json({ error: true, message: 'Categoría o proveedor no existe' })
        }
        // Errores lanzados por el SP con RAISE EXCEPTION
        if (err.message) {
            return res.status(400).json({ error: true, message: err.message })
        }
        next(err)
    }
}

// PUT /api/productos/:id — Sequelize update
const update = async(req, res, next) => {
    try {
        const {
            id_categoria,
            id_proveedor,
            nombre,
            sku,
            marca,
            descripcion,
            genero,
            precio_actual,
            imagen
        } = req.body

        const producto = await Producto.findByPk(req.params.id)
        if (!producto) {
            return res.status(404).json({ error: true, message: 'Producto no encontrado' })
        }

        await producto.update({
            id_categoria,
            id_proveedor,
            nombre,
            sku,
            marca,
            descripcion,
            genero,
            precio_actual,
            imagen
        })
        res.json(producto)
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: true, message: 'Ya existe un producto con ese SKU' })
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: true, message: err.errors[0].message })
        }
        next(err)
    }
}

// DELETE /api/productos/:id — Sequelize destroy
const remove = async(req, res, next) => {
    try {
        const producto = await Producto.findByPk(req.params.id)
        if (!producto) {
            return res.status(404).json({ error: true, message: 'Producto no encontrado' })
        }
        await producto.destroy()
        res.json({ message: 'Producto eliminado correctamente' })
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError' || err.code === '23503') {
            return res.status(400).json({ error: true, message: 'No se puede eliminar, tiene variantes asociadas' })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create, update, remove }
