const express = require('express')
const ctrl = require('../controllers/auth.controller')
const { requireAuth } = require('../middlewares/auth')

const router = express.Router()

router.post('/login', ctrl.login)
router.get('/me', requireAuth, ctrl.me)
router.post('/logout', requireAuth, ctrl.logout)

module.exports = router