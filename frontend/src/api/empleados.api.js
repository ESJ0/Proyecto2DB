import {get, post, put, remove } from './index'

export const getEmpleados = () => get('/empleados')
export const getEmpleado = (id) => get(`/empleados/${id}`)
export const createEmpleado = (data) => post('/empleados', data)
export const updateEmpleado = (id, data) => put(`/empleados/${id}`, data)
export const deleteEmpleado = (id) => remove(`/empleados/${id}`)