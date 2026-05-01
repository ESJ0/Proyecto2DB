const express = require('express')
const router = express.Router()
const controller = require('../controllers/reportes.controller')

router.get('/ventas-detalladas', controller.ventasDetalladas)
router.get('/inventario', controller.inventarioCompleto)
router.get('/detalle-ventas-productos', controller.detalleVentasProductos)
router.get('/clientes-con-compras', controller.clientesConCompras)
router.get('/productos-stock-bajo-promedio', controller.productosStockBajoPromedio)
router.get('/categorias-mas-vendidas', controller.categoriasMasVendidas)
router.get('/top-productos-mes', controller.topProductosMes)
router.get('/ventas-por-empleado', controller.ventasPorEmpleado)
router.get('/productos-mas-vendidos', controller.productosMasVendidos)

module.exports = router