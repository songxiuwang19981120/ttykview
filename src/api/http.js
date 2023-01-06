import service from './common'
import API_LIST from '@/config/api.config'
import store from 'store'
import base from '@/config/base.config'
const { TOKEN_NAME,USERINFO } = base


export default async function Http({ type, data }) {
  if (!(type in API_LIST)) {
    throw new Error('API请求错误')
  }
  let { url, method, setToken = false } = API_LIST[type]
  try {
    method = method.toLowerCase()
    data = method === 'get' ? { params: data } : data
    let result = await service[method](url, data)
     if (setToken) {
      let token = result.token;
      let data = result.data
      store.set(TOKEN_NAME, token)
      store.set(USERINFO,data)
      //this.$store.dispatch('login')

    } 
    return result
  } catch (error) {
    this.$message.error({
      message: '网络开小差了'
    })
    return Promise.reject(error);
  }
}
