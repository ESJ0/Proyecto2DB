import { post } from './index'

export const loginApi = (credentials) => post('/auth/login', credentials)
export const logoutApi = () => post('/auth/logout')