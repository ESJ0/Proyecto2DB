const express = require('express')
const router = express.Router()
const controller = require('../controllers/empleados.controller')
const validateBody = require('../middlewares/validateBody')

const requiredFields = ['nombre', 'email', 'cargo', 'fecha_contra']

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', validateBody(requiredFields), controller.create)
router.put('/:id', validateBody(requiredFields), controller.update)
router.delete('/:id', controller.remove)

module.exports = router