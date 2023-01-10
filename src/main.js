import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import animated from 'animate.css'

import '@/plugin/element.plugin'
import '@/plugin/http.plugin'
import '@/plugin/vuehappyscroll.plugin'


import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import '@/assets/css/global.styl'
import '@/assets/css/page.css';

import '@/assets/css/iconfont.css'
// Vue.use(animated)
Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false

Vue.directive('loadMore', {
  bind(el, binding) {
    let select_dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
    select_dom.addEventListener('scroll', function () {
      let height = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (height) {
        binding.value()
      }
    })
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
