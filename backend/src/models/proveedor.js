const { DataTypes } = require('sequelize')
const sequelize = require('../database/sequelize')

const Proveedor = sequelize.define('Proveedor', {
    id_proveedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: { isEmail: true }
    }
}, {
    tableName: 'proveedor',
    timestamps: false
})

module.exports = Proveedor