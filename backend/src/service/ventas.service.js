const { withTransaction } = require('../context/db.context')
const ventasDao = require('../daos/ventas.dao')
const variantesDao = require('../daos/variantes.dao')

const registrarVenta = async({ id_cliente, id_empleado, metodo_pago, items }) => {
    return await withTransaction(async(client) => {

        // 1. Verificar stock de cada variante
        for (const item of items) {
            const variante = await client.query(
                'SELECT stock_total FROM ProductoVariante WHERE id_variante = $1', [item.id_variante]
            )

            if (!variante.rows[0]) {
                throw { status: 404, message: `Variante ${item.id_variante} no encontrada` }
            }

            if (variante.rows[0].stock_total < item.cantidad) {
                throw {
                    status: 400,
                    message: `Stock insuficiente para variante ${item.id_variante}. 
                    Stock disponible: ${variante.rows[0].stock_total}`
                }
            }
        }

        // 2. Crear la venta
        const venta = await ventasDao.createVenta(client, { id_cliente, id_empleado, metodo_pago })

        // 3. Crear cada detalle y descontar stock
        for (const item of items) {
            await ventasDao.createDetalle(client, {
                id_venta: venta.id_venta,
                id_variante: item.id_variante,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario
            })

            const actualizada = await variantesDao.descontarStock(client, item.id_variante, item.cantidad)
            if (!actualizada) {
                throw { status: 400, message: `No se pudo descontar stock de variante ${item.id_variante}` }
            }
        }

        return venta
    })
}

module.exports = { registrarVenta }