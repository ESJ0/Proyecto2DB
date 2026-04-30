export const formatCurrency = (value) => {
    if (value == null) return '—'
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
        minimumFractionDigits: 2
    }).format(value)
}

export const formatDate = (value) => {
    if (!value) return '—'
    return new Intl.DateTimeFormat('es-GT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(value))
}

export const formatDateTime = (value) => {
    if (!value) return '—'
    return new Intl.DateTimeFormat('es-GT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value))
}