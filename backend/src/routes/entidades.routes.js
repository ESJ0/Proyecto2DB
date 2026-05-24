// ── productos.routes.js ──────────────────────────────────────
const express = require('express')
const { requireAuth, requireRole } = require('../middlewares/auth')
const validate = require('../middlewares/validateBody')

// Productos
const productosRouter = express.Router()
const pCtrl = require('../controllers/productos.controller')
const P_WRITE = ['admin', 'inventario']
const P_READ = ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web']
const P_REQUIRED = ['id_categoria', 'id_proveedor', 'nombre', 'sku', 'marca', 'descripcion', 'genero', 'precio_actual', 'imagen']

productosRouter.get('/', requireAuth, requireRole(P_READ), pCtrl.getAll)
productosRouter.get('/:id', requireAuth, requireRole(P_READ), pCtrl.getById)
productosRouter.post('/', requireAuth, requireRole(P_WRITE), validate(P_REQUIRED), pCtrl.create)
productosRouter.put('/:id', requireAuth, requireRole(P_WRITE), validate(P_REQUIRED), pCtrl.update)
productosRouter.delete('/:id', requireAuth, requireRole(['admin']), pCtrl.remove)

// Clientes
const clientesRouter = express.Router()
const cCtrl = require('../controllers/clientes.controller')
const C_WRITE = ['admin', 'vendedor']
const C_READ = ['admin', 'vendedor', 'reportes']

clientesRouter.get('/', requireAuth, requireRole(C_READ), cCtrl.getAll)
clientesRouter.get('/:id', requireAuth, requireRole(C_READ), cCtrl.getById)
clientesRouter.post('/', requireAuth, requireRole(C_WRITE), validate(['nombre']), cCtrl.create)
clientesRouter.put('/:id', requireAuth, requireRole(C_WRITE), validate(['nombre']), cCtrl.update)
clientesRouter.delete('/:id', requireAuth, requireRole(['admin']), cCtrl.remove)

// Variantes
const variantesRouter = express.Router()
const vCtrl = require('../controllers/variantes.controller')
const V_REQUIRED = ['id_producto', 'talla', 'color', 'peso', 'alto', 'ancho', 'largo']

variantesRouter.get('/', requireAuth, requireRole(['admin', 'inventario', 'vendedor', 'reportes']), vCtrl.getAll)
variantesRouter.get('/producto/:id_producto', requireAuth, requireRole(['admin', 'inventario', 'vendedor']), vCtrl.getByProducto)
variantesRouter.get('/:id', requireAuth, requireRole(['admin', 'inventario', 'vendedor', 'reportes']), vCtrl.getById)
variantesRouter.post('/', requireAuth, requireRole(['admin', 'inventario']), validate(V_REQUIRED), vCtrl.create)
variantesRouter.put('/:id', requireAuth, requireRole(['admin', 'inventario']), validate(V_REQUIRED), vCtrl.update)
variantesRouter.delete('/:id', requireAuth, requireRole(['admin']), vCtrl.remove)
    // SP sp_actualizar_stock
variantesRouter.patch('/:id/stock', requireAuth, requireRole(['admin', 'inventario']), validate(['cantidad']), vCtrl.actualizarStock)

// Proveedores
const proveedoresRouter = express.Router()
const { proveedores: prvCtrl } = require('../controllers/misc.controller')

proveedoresRouter.get('/', requireAuth, requireRole(['admin', 'inventario', 'reportes']), prvCtrl.getAll)
proveedoresRouter.get('/:id', requireAuth, requireRole(['admin', 'inventario', 'reportes']), prvCtrl.getById)
proveedoresRouter.post('/', requireAuth, requireRole(['admin', 'inventario']), validate(['nombre']), prvCtrl.create)
proveedoresRouter.put('/:id', requireAuth, requireRole(['admin', 'inventario']), validate(['nombre']), prvCtrl.update)
proveedoresRouter.delete('/:id', requireAuth, requireRole(['admin']), prvCtrl.remove)

// Empleados
const empleadosRouter = require('express').Router()
const { empleados: empCtrl } = require('../controllers/misc.controller')
const E_REQUIRED = ['nombre', 'email', 'fecha_contra']

empleadosRouter.get('/', requireAuth, requireRole(['admin', 'vendedor', 'reportes']), empCtrl.getAll)
empleadosRouter.get('/:id', requireAuth, requireRole(['admin', 'vendedor', 'reportes']), empCtrl.getById)
empleadosRouter.post('/', requireAuth, requireRole(['admin']), validate(E_REQUIRED), empCtrl.create)
empleadosRouter.put('/:id', requireAuth, requireRole(['admin']), validate(E_REQUIRED), empCtrl.update)
empleadosRouter.delete('/:id', requireAuth, requireRole(['admin']), empCtrl.remove)

// Ventas
const ventasRouter = express.Router()
const ventCtrl = require('../controllers/ventas.controller')

ventasRouter.get('/', requireAuth, requireRole(['admin', 'vendedor', 'reportes']), ventCtrl.getAll)
ventasRouter.get('/:id', requireAuth, requireRole(['admin', 'vendedor', 'reportes']), ventCtrl.getById)
ventasRouter.post('/', requireAuth, requireRole(['admin', 'vendedor']),
    validate(['id_cliente', 'id_empleado', 'metodo_pago', 'items']),
    ventCtrl.create
)

// Reportes
const reportesRouter = express.Router()
const rCtrl = require('../controllers/reportes.controller')
const R_ROLES = ['admin', 'reportes']

reportesRouter.get('/ventas-detalladas', requireAuth, requireRole(R_ROLES), rCtrl.ventasDetalladas)
reportesRouter.get('/inventario', requireAuth, requireRole(['admin', 'inventario', 'reportes']), rCtrl.inventarioCompleto)
reportesRouter.get('/detalle-ventas-productos', requireAuth, requireRole(R_ROLES), rCtrl.detalleVentasProductos)
reportesRouter.get('/clientes-con-compras', requireAuth, requireRole(R_ROLES), rCtrl.clientesConCompras)
reportesRouter.get('/productos-stock-bajo-promedio', requireAuth, requireRole(['admin', 'inventario', 'reportes']), rCtrl.productosStockBajoPromedio)
reportesRouter.get('/categorias-mas-vendidas', requireAuth, requireRole(R_ROLES), rCtrl.categoriasMasVendidas)
reportesRouter.get('/top-productos-mes', requireAuth, requireRole(R_ROLES), rCtrl.topProductosMes)
reportesRouter.get('/ventas-por-empleado', requireAuth, requireRole(R_ROLES), rCtrl.ventasPorEmpleado)
reportesRouter.get('/productos-mas-vendidos', requireAuth, requireRole(R_ROLES), rCtrl.productosMasVendidos)
    // SP sp_reporte_ventas_periodo
reportesRouter.get('/ventas-periodo', requireAuth, requireRole(R_ROLES), rCtrl.ventasPeriodo)

module.exports = {
    productosRouter,
    clientesRouter,
    variantesRouter,
    proveedoresRouter,
    empleadosRouter,
    ventasRouter,
    reportesRouter
}