const jwt = require('jsonwebtoken')

// Verifica que el token JWT sea válido
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: true, message: 'Token requerido' })
    }

    const token = header.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = payload
        next()
    } catch (err) {
        return res.status(401).json({ error: true, message: 'Token inválido o expirado' })
    }
}

// Verifica que el rol del usuario esté en la lista permitida
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: true, message: 'No autenticado' })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: true,
                message: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}`
            })
        }

        next()
    }
}

module.exports = { requireAuth, requireRole }