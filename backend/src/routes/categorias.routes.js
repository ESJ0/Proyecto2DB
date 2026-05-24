const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/categorias.controller')
const validate = require('../middlewares/validateBody')
const { requireAuth, requireRole } = require('../middlewares/auth')

const WRITE = ['admin', 'inventario']
const READ = ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web']

router.get('/', requireAuth, requireRole(READ), ctrl.getAll)
router.get('/:id', requireAuth, requireRole(READ), ctrl.getById)
router.post('/', requireAuth, requireRole(WRITE), validate(['nombre']), ctrl.create)
router.put('/:id', requireAuth, requireRole(WRITE), validate(['nombre']), ctrl.update)
router.delete('/:id', requireAuth, requireRole(['admin']), ctrl.remove)

module.exports = router