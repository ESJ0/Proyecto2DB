import {get, post, put, remove } from './index'

export const getCategorias = () => get('/categorias')
export const getCategoria = (id) => get(`/categorias/${id}`)
export const createCategoria = (data) => post('/categorias', data)
export const updateCategoria = (id, data) => put(`/categorias/${id}`, data)
export const deleteCategoria = (id) => remove(`/categorias/${id}`)