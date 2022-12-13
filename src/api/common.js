import axios from 'axios'
import base from '@/config/base.config'

const { TIMEOUT, BASE_URL } = base

const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT
})


service.interceptors.response.use((response) => {
  //剥离最外层
  let result = response?.data
  return {
    data:result?.data,
    msg:result.msg ?? '未知信息',
    status:result?.status
  };
}, (error) => {
  return Promise.reject(error);
});

export default service


