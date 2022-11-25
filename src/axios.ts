import axios from 'axios'
axios.defaults.baseURL = 'http://178.128.26.253:8000/v1'
axios.defaults.headers.post['Content-Type'] = 'application/json'
export default axios
