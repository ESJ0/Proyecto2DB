import {get, post, put, remove } from './index'

export const getProveedores = () => get('/proveedores')
export const getProveedor = (id) => get(`/proveedores/${id}`)
export const createProveedor = (data) => post('/proveedores', data)
export const updateProveedor = (id, data) => put(`/proveedores/${id}`, data)
export const deleteProveedor = (id) => remove(`/proveedores/${id}`)