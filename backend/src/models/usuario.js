const { DataTypes } = require('sequelize')
const sequelize = require('../database/sequelize')

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isIn: [
                ['admin', 'vendedor', 'inventario', 'reportes', 'cliente_web']
            ]
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'usuario',
    timestamps: false
})

module.exports = Usuario