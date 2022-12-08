import axios from 'axios'
import base from '@/config/base.config'

const { TIMEOUT, BASE_URL } = base

const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT
})


service.interceptors.response.use((response) => {
  //剥离最外层
  let result = response.data
  return result?.data;
}, (error) => {
  return Promise.reject(error);
});

export default service


