const BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const request = async(method, path, body) => {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Error en la solicitud')
    }

    return data
}

export const get = (path) => request('GET', path)
export const post = (path, body) => request('POST', path, body)
export const put = (path, body) => request('PUT', path, body)
export const remove = (path) => request('DELETE', path)