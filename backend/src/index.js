require('dotenv').config()
const express = require('express')
const express = require('express')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

const categoriasRoutes = require('./routes/categorias.routes')
const productosRoutes = require('./routes/productos.routes')
const variantesRoutes = require('./routes/variantes.routes')
const proveedoresRoutes = require('./routes/proveedores.routes')
const clientesRoutes = require('./routes/clientes.routes')
const empleadosRoutes = require('./routes/empleados.routes')
const ventasRoutes = require('./routes/ventas.routes')
const reportesRoutes = require('./routes/reportes.routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/categorias', categoriasRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/variantes', variantesRoutes)
app.use('/api/proveedores', proveedoresRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/empleados', empleadosRoutes)
app.use('/api/ventas', ventasRoutes)
app.use('/api/reportes', reportesRoutes)

// Manejo de errores
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})