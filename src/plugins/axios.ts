import axios from 'axios'

const config = { baseURL: import.meta.env.VITE_APP_BASE_URL }
const axiosI = axios.create(config)

export default axiosI
