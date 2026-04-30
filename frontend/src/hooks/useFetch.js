import { useState, useEffect } from 'react'

export default function useFetch(fetchFn, deps = []) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = async() => {
        try {
            setLoading(true)
            setError(null)
            const result = await fetchFn()
            setData(result)
        } catch (err) {
            setError(err.message || 'Error al cargar datos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, deps)

    return { data, loading, error, reload: load }
}