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

export const denyPermission = () => {
  alert('No tienes permiso para realizar esta accion.')
}

export const defaultPathForRole = (role) =>
  DASHBOARD_ROLES.includes(role) ? '/dashboard' : '/productos'
