export const DASHBOARD_ROLES = ['admin', 'reportes']

export const PERMISSIONS = {
    productos: {
        create: ['admin', 'inventario'],
        update: ['admin', 'inventario'],
        delete: ['admin'],
    },
    variantes: {
        create: ['admin', 'inventario'],
        update: ['admin', 'inventario'],
        delete: ['admin'],
    },
    categorias: {
        create: ['admin', 'inventario'],
        update: ['admin', 'inventario'],
        delete: ['admin'],
    },
    proveedores: {
        create: ['admin', 'inventario'],
        update: ['admin', 'inventario'],
        delete: ['admin'],
    },
    clientes: {
        create: ['admin', 'vendedor'],
        update: ['admin', 'vendedor'],
        delete: ['admin'],
    },
    empleados: {
        create: ['admin'],
        update: ['admin'],
        delete: ['admin'],
    },
    ventas: {
        create: ['admin', 'vendedor'],
    },
}

export const can = (role, resource, action) =>
    Boolean(role && PERMISSIONS[resource]?.[action]?.includes(role))

// Primera ruta disponible según el rol
export const defaultPathForRole = (role) => {
    switch (role) {
        case 'admin':
        case 'reportes':
            return '/dashboard'
        case 'inventario':
            return '/productos'
        case 'vendedor':
            return '/productos'
        case 'cliente_web':
            return '/productos'
        default:
            return '/productos'
    }
}

// Contexto global para mostrar el modal de permiso denegado
export const denyPermission = () => {
    window.dispatchEvent(new CustomEvent('permission-denied'))
}