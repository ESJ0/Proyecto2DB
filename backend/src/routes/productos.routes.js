const express = require('express')
const router = express.Router()
const controller = require('../controllers/productos.controller')
const validateBody = require('../middlewares/validateBody')

const requiredFields = [
    'id_categoria', 'id_proveedor', 'nombre',
    'sku', 'marca', 'descripcion', 'genero',
    'precio_actual', 'imagen'
]

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', validateBody(requiredFields), controller.create)
router.put('/:id', validateBody(requiredFields), controller.update)
router.delete('/:id', controller.remove)

module.exports = router