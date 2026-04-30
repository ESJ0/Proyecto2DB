const express = require('express')
const router = express.Router()
const controller = require('../controllers/ventas.controller')
const validateBody = require('../middlewares/validateBody')

const requiredFields = ['id_cliente', 'id_empleado', 'metodo_pago', 'items']

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', validateBody(requiredFields), controller.create)

// Las ventas no se editan ni eliminan — son registros contables
module.exports = router