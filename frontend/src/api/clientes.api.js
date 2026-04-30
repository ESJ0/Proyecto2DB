import {get, post, put, remove } from './index'

export const getClientes = () => get('/clientes')
export const getCliente = (id) => get(`/clientes/${id}`)
export const createCliente = (data) => post('/clientes', data)
export const updateCliente = (id, data) => put(`/clientes/${id}`, data)
export const deleteCliente = (id) => remove(`/clientes/${id}`)