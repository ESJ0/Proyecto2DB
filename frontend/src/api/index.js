const BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const request = async(method, path, body) => {
    const token = localStorage.getItem('token')

    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    })

    // Si el token expiró, limpiar sesión y recargar
    if (res.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        window.location.href = '/login'
        return
    }

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || 'Error en la solicitud')
    }

    return data
}

export const get = (path) => request('GET', path)
export const post = (path, body) => request('POST', path, body)
export const put = (path, body) => request('PUT', path, body)
export const patch = (path, body) => request('PATCH', path, body)
export const remove = (path) => request('DELETE', path)