const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

// POST /api/auth/login
const login = async(req, res, next) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: true, message: 'Usuario y contraseña requeridos' })
        }

        // Buscar usuario por username (Sequelize — ORM)
        const usuario = await Usuario.findOne({ where: { username, activo: true } })

        if (!usuario) {
            return res.status(401).json({ error: true, message: 'Credenciales incorrectas' })
        }

        // Comparar contraseña con el hash almacenado
        const passwordOk = await bcrypt.compare(password, usuario.password_hash)

        if (!passwordOk) {
            return res.status(401).json({ error: true, message: 'Credenciales incorrectas' })
        }

        // Generar JWT con payload básico
        const token = jwt.sign({
                id_usuario: usuario.id_usuario,
                username: usuario.username,
                rol: usuario.rol
            },
            process.env.JWT_SECRET, { expiresIn: '8h' }
        )

        res.json({
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                username: usuario.username,
                rol: usuario.rol
            }
        })
    } catch (err) {
        next(err)
    }
}

// GET /api/auth/me  — devuelve el usuario del token actual
const me = async(req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id_usuario, {
            attributes: ['id_usuario', 'username', 'rol', 'activo']
        })

        if (!usuario) {
            return res.status(404).json({ error: true, message: 'Usuario no encontrado' })
        }

        res.json(usuario)
    } catch (err) {
        next(err)
    }
}

// POST /api/auth/logout — el cliente descarta el token; el server confirma
const logout = (req, res) => {
    res.json({ message: 'Sesión cerrada correctamente' })
}

module.exports = { login, me, logout }