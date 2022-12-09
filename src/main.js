import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/plugin/element.plugin'
import '@/plugin/http.plugin'


import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.styl'
//bootstrap vue
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);


Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
