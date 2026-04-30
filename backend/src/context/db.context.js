const pool = require('../database/pool')

// Provee un client con transaccion activa
// Lo usan los services que necesitan BEGIN/COMMIT/ROLLBACK
const withTransaction = async(callback) => {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const result = await callback(client)
        await client.query('COMMIT')
        return result
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

module.exports = { withTransaction }