const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

pool.connect()
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch(err => console.error('Error al conectar a la base de datos', err))

module.exports = pool