import axios from 'axios'
axios.defaults.baseURL =
    process.env.NEXTBACKED_URL || 'http://localhost:8000/v1'
axios.defaults.headers.post['Content-Type'] = 'application/json'
export default axios
