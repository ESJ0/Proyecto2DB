import {get } from './index'

export const getVentasDetalladas = () => get('/reportes/ventas-detalladas')
export const getInventarioCompleto = () => get('/reportes/inventario')
export const getDetalleVentasProductos = () => get('/reportes/detalle-ventas-productos')
export const getClientesConCompras = () => get('/reportes/clientes-con-compras')
export const getProductosStockBajo = () => get('/reportes/productos-stock-bajo-promedio')
export const getCategoriasMasVendidas = () => get('/reportes/categorias-mas-vendidas')
export const getTopProductosMes = () => get('/reportes/top-productos-mes')
export const getVentasPorEmpleado = () => get('/reportes/ventas-por-empleado')
export const getProductosMasVendidos = () => get('/reportes/productos-mas-vendidos')