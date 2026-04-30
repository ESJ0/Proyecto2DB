const express = require('express')
const router = express.Router()
const controller = require('../controllers/variantes.controller')
const validateBody = require('../middlewares/validateBody')

const requiredFields = [
    'id_producto', 'talla', 'color',
    'peso', 'alto', 'ancho', 'largo'
]

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.get('/producto/:id_producto', controller.getByProducto)
router.post('/', validateBody(requiredFields), controller.create)
router.put('/:id', validateBody(requiredFields), controller.update)
router.delete('/:id', controller.remove)

module.exports = router