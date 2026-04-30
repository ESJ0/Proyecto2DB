const pool = require('../database/pool')
const ventasDao = require('../daos/ventas.dao')
const variantesDao = require('../daos/variantes.dao')


//items es un array con el detalle de la venta:
const registrarVenta = async({ id_cliente, id_empleado, metodo_pago, items }) => {
    // Obtenemos un client del pool para manejar la transaccion manualmente
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // 1. Verificar stock de cada variante antes de proceder
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
                    message: `Stock insuficiente para variante ${item.id_variante}. Stock disponible: ${variante.rows[0].stock_total}`
                }
            }
        }

        // 2. Crear la venta
        const venta = await ventasDao.createVenta(client, { id_cliente, id_empleado, metodo_pago })

        // 3. Crear cada detalle y descontar stock
        for (const item of items) {
            // Insertar detalle
            await ventasDao.createDetalle(client, {
                id_venta: venta.id_venta,
                id_variante: item.id_variante,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario
            })

            // Descontar stock — si no hay stock suficiente retorna null y hacemos ROLLBACK
            const actualizada = await variantesDao.descontarStock(client, item.id_variante, item.cantidad)
            if (!actualizada) {
                throw { status: 400, message: `No se pudo descontar stock de variante ${item.id_variante}` }
            }
        }

        await client.query('COMMIT')
        return venta

    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        // Siempre liberar el client de vuelta al pool
        client.release()
    }
}

module.exports = { registrarVenta }