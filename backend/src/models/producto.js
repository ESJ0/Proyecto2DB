const { DataTypes } = require('sequelize')
const sequelize = require('../database/sequelize')

const Producto = sequelize.define('Producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true }
    },
    sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    marca: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    genero: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { isIn: [
                ['M', 'F', 'Unisex']
            ] }
    },
    precio_actual: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0.01 }
    },
    imagen: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'producto',
    timestamps: false
})

module.exports = Producto