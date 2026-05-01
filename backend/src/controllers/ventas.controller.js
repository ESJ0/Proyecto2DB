const dao = require('../daos/ventas.dao')
const service = require('../services/ventas.service')

const getAll = async(req, res, next) => {
    try {
        const ventas = await dao.getAll()
        res.json(ventas)
    } catch (err) {
        next(err)
    }
}

const getById = async(req, res, next) => {
    try {
        const venta = await dao.getById(req.params.id)
        if (!venta) {
            return res.status(404).json({ error: true, message: 'Venta no encontrada' })
        }
        res.json(venta)
    } catch (err) {
        next(err)
    }
}

const create = async(req, res, next) => {
    try {
        const { id_cliente, id_empleado, metodo_pago, items } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: true, message: 'La venta debe tener al menos un producto' })
        }

        const venta = await service.registrarVenta({ id_cliente, id_empleado, metodo_pago, items })
        res.status(201).json(venta)
    } catch (err) {
        // Errores lanzados manualmente desde el service
        if (err.status) {
            return res.status(err.status).json({ error: true, message: err.message })
        }
        next(err)
    }
}

module.exports = { getAll, getById, create }