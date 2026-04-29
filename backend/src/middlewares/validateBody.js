const validateBody = (requiredFields) => {
    return (req, res, next) => {
        const missing = requiredFields.filter(field => {
            return req.body[field] === undefined || req.body[field] === ''
        })

        if (missing.length > 0) {
            return res.status(400).json({
                error: true,
                message: `Campos requeridos faltantes: ${missing.join(', ')}`
            })
        }

        next()
    }
}

module.exports = validateBody