const dao = require('../daos/reportes.dao')

const ventasDetalladas = async(req, res, next) => {
    try {
        const data = await dao.ventasDetalladas()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const inventarioCompleto = async(req, res, next) => {
    try {
        const data = await dao.inventarioCompleto()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const detalleVentasProductos = async(req, res, next) => {
    try {
        const data = await dao.detalleVentasProductos()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const clientesConCompras = async(req, res, next) => {
    try {
        const data = await dao.clientesConCompras()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const productosStockBajoPromedio = async(req, res, next) => {
    try {
        const data = await dao.productosStockBajoPromedio()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const categoriasMasVendidas = async(req, res, next) => {
    try {
        const data = await dao.categoriasMasVendidas()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const topProductosMes = async(req, res, next) => {
    try {
        const data = await dao.topProductosMes()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const ventasPorEmpleado = async(req, res, next) => {
    try {
        const data = await dao.ventasPorEmpleado()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

const productosMasVendidos = async(req, res, next) => {
    try {
        const data = await dao.productosMasVendidos()
        res.json(data)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    ventasDetalladas,
    inventarioCompleto,
    detalleVentasProductos,
    clientesConCompras,
    productosStockBajoPromedio,
    categoriasMasVendidas,
    topProductosMes,
    ventasPorEmpleado,
    productosMasVendidos
}