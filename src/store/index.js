import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store'
import base from '@/config/base.config'
import http from '@/api/http'
import router from '../router'
const { TOKEN_NAME, USERINFO } = base

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: store.get(TOKEN_NAME) || "",
    userInfo: store.get(USERINFO) || {},
  },
  getters: {
    userInfo(state) {
      if (state.token) {
        return state.userInfo
      }
    }
  },
  mutations: {
    SET_TOKEN(state) {
      state.token = store.get(TOKEN_NAME)
    },
    SET_USERINFO(state, userInfo) {
      console.log(JSON.parse(userInfo))
      state.userInfo = JSON.parse(userInfo)
    },
    LOGOUT(state) {
      state.token = ""
      state.userInfo = {}
      store.remove(TOKEN_NAME)
      store.remove(USERINFO)
    },
  },
  actions: {
    async register({ commit }, { data }) {
      try {
        let result = await http({ type: "register", data })
        let msg = result?.msg ?? '未知错误，请重新登录'
        console.log(result)
        if (result.status == 200) {
          Vue.prototype.$notify.success({
            title: "注册成功",
            position: 'top-left'
          });
          let userInfo = JSON.stringify(result.data)
          commit('SET_USERINFO', userInfo)
          commit('SET_TOKEN')
          router.push("/index");
          Vue.prototype.$notify.success({
            title: '登录成功',
            message: `欢迎您，尊敬的${this.state.userInfo.username}`,
            position: 'top-left'
          })
          return;
        }
        Vue.prototype.$notify.error({
          title: '登录失败',
          message: msg,
          position: 'top-left'
        });
      } catch (error) {
        Vue.prototype.$notify.error({
          title: '登录失败',
          message: msg,
          position: 'top-left'
        })
        console.log(error);
      }

    },


    async login({ commit }, { data }) {
      try {
        let result = await http({ type: "login", data });
        let msg = result?.msg ?? '未知错误，请重新登录'
        if (result.status == 200) {
          let userInfo = JSON.stringify(result.data);
          commit('SET_USERINFO', userInfo)
          commit('SET_TOKEN')
          router.push("/index");
          Vue.prototype.$notify.success({
            title: '登录成功',
            message: `欢迎您，尊敬的${this.state.userInfo.username}`,
            position: 'top-left'
          })
          return;
        }
        Vue.prototype.$notify.error({
          title: '登录失败',
          message: msg
        });
      } catch (error) {
        Vue.prototype.$notify.error({
          title: '登录失败',
          message: `未知错误，请重新登录`,
          position: 'top-left'
        })
        console.log(error);
      }
    },


    logout({ commit }) {
      Vue.prototype.$notify.success({
        title: '退出成功',
        message: `再见，尊敬的${this.state.userInfo.username}`,
        position: 'top-left'
      })
      commit('LOGOUT')
    }
  },
  modules: {

  }
})
