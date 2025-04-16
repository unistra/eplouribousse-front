import axios from 'axios'

const config = { baseURL: import.meta.env.VITE_APP_BASE_URL }
const _axios = axios.create(config)

export default _axios
