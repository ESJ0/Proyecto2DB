import {get, post, put, patch, remove } from './index'

export const getVariantes = () => get('/variantes')
export const getVariante = (id) => get(`/variantes/${id}`)
export const getVariantesByProducto = (id) => get(`/variantes/producto/${id}`)
export const createVariante = (data) => post('/variantes', data)
export const updateVariante = (id, data) => put(`/variantes/${id}`, data)
export const deleteVariante = (id) => remove(`/variantes/${id}`)
export const actualizarStock = (id, data) => patch(`/variantes/${id}/stock`, data)