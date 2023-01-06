import axios from 'axios'
import base from '@/config/base.config'
import store from 'store'
import Vue from 'vue'
import router from '../router'

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
  if(response?.data?.code == 101){
    store.remove("page");
    store.remove("limit");
    store.remove("group");
    store.remove("typecontrol_id");
    store.remove("fans");
    Vue.prototype.$notify.error({
      title: '登录过期',
      message: '登录过期，请重新登录',
      position: 'top-left'
    });
    router.push("/login");
  }
  let result = response?.data
  return {
    data:result?.data,
    msg:result.msg ?? '未知信息',
    status:result?.status,
    token:result?.token,
    code:result?.code
  };
}, (error) => {
  return Promise.reject(error);
});

export default service


