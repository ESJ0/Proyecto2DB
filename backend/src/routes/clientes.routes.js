const express = require('express')
const router = express.Router()
const controller = require('../controllers/clientes.controller')
const validateBody = require('../middlewares/validateBody')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', validateBody(['nombre']), controller.create)
router.put('/:id', validateBody(['nombre']), controller.update)
router.delete('/:id', controller.remove)

module.exports = router