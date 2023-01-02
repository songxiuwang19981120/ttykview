import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store'
import base from '@/config/base.config'
const { TOKEN_NAME } = base

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: store.get(TOKEN_NAME) || "",
    userInfo: {},
  },
  getters: {
    userInfo (state) {
      if (state.token) {
        return state.userInfo
      }
    }
  },
  mutations: {
    SET_TOKEN (state) {
      state.token = store.get(TOKEN_NAME)
    },
    SET_USERINFO (state, userInfo) {
      state.userInfo = userInfo
    },
    CANCEL_TOKEN (state) {
      state.token = ""
      store.remove(TOKEN_NAME)
    },
  },
  actions: {
    async login ({ dispatch, commit }) {
      commit('SET_TOKEN')
      dispatch('getUserInfo')
    },
    async getUserInfo ({ commit, dispatch }) {
      try {
        let userInfo = await http({ type: 'getUserInfo' })
        commit('SET_USERINFO', userInfo)
        Vue.prototype.$notify.success({
          title: '登录成功',
          message: `欢迎你 ${userInfo.nikname}`
        })
       
      } catch (err) {
        console.log(err)
      }
    }
  },
  modules: {
    
  }
})
