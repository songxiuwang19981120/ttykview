import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import animated from 'animate.css'

import '@/plugin/element.plugin'
import '@/plugin/http.plugin'
import '@/plugin/vuescroll.plugin'

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.styl'
import '@/assets/css/page.css';

import '@/assets/css/iconfont.css'
// Vue.use(animated)
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
