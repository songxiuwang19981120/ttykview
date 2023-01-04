import axios from 'axios'
import base from '@/config/base.config'
import store from 'store'


const { TIMEOUT, BASE_URL,TOKEN_NAME } = base



const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT
})


service.interceptors.request.use(async (config) => {
  let token = store.get(TOKEN_NAME)
  if (token) {
    config.headers['Authorization'] = `${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error);
});


service.interceptors.response.use((response) => {
  //剥离最外层
  let result = response?.data
  return {
    data:result?.data,
    msg:result.msg ?? '未知信息',
    status:result?.status,
    token:result?.token
  };
}, (error) => {
  return Promise.reject(error);
});

export default service


