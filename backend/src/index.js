require('dotenv').config()
const express = require('express')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')

// Rutas
const authRoutes = require('./routes/auth.routes.js')
const categoriasRoutes = require('./routes/categorias.routes')
const {
    productosRouter,
    clientesRouter,
    variantesRouter,
    proveedoresRouter,
    empleadosRouter,
    ventasRouter,
    reportesRouter
} = require('./routes/entidades.routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// ── Auth (pública) ───────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ── Entidades (protegidas por requireAuth + requireRole) ─────
app.use('/api/categorias', categoriasRoutes)
app.use('/api/productos', productosRouter)
app.use('/api/clientes', clientesRouter)
app.use('/api/variantes', variantesRouter)
app.use('/api/proveedores', proveedoresRouter)
app.use('/api/empleados', empleadosRouter)
app.use('/api/ventas', ventasRouter)
app.use('/api/reportes', reportesRouter)

// ── Error handler ────────────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`✔ Servidor corriendo en puerto ${PORT}`)
})