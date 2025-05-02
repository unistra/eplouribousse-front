import axios from 'axios'
import { axiosRequestInterceptor } from '@/plugins/useAxios.ts'

const config = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
}
const axiosI = axios.create(config)

axiosI.interceptors.request.use(axiosRequestInterceptor, (error: unknown) => {
    return Promise.reject(error)
})

export default axiosI
