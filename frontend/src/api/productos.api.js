import {get, post, put, remove } from './index'

export const getProductos = () => get('/productos')
export const getProducto = (id) => get(`/productos/${id}`)
export const createProducto = (data) => post('/productos', data)
export const updateProducto = (id, data) => put(`/productos/${id}`, data)
export const deleteProducto = (id) => remove(`/productos/${id}`)