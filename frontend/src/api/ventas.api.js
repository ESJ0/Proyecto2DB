import {get, post } from './index'

export const getVentas = () => get('/ventas')
export const getVenta = (id) => get(`/ventas/${id}`)
export const createVenta = (data) => post('/ventas', data)