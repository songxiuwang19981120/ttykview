import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component:() => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path:'/',
    name:'layout',
    component:() => import(/* webpackChunkName: "layout" */ '@/views/LayOut.vue'),
    redirect:'/index',
    children:[
      {
        path:'/index',
        name:'index',
        component:() => import(/* webpackChunkName: "equgroup" */ '@/views/Index.vue')
      },
      //账号管理 start
      {
        path:'/accsituation',
        name:'accsituation',
        component:() => import(/* webpackChunkName: "accsituation" */ '@/views/account/AccountSituation.vue'),
        //账号情况 详情

      },
      {
        path:'/equgroup',
        name:'equgroup',
        component:() => import(/* webpackChunkName: "equgroup" */ '@/views/account/AccGroup.vue')
      },
      //账号管理 end

      //任务管理 start
      {
        path:'/collection',
        name:'collection',
        component:() => import(/* webpackChunkName: "collection" */ '@/views/task/Collection.vue')
      },
      {
        path:'/private',
        name:'private',
        component:() => import(/* webpackChunkName: "private" */ '@/views/task/PrivateLetter.vue')
      },
      {
        path:'/material',
        name:'material',
        component:() => import(/* webpackChunkName: "material" */ '@/views/task/Material.vue')
      },
      {
        path:'/accountedit',
        name:'accountedit',
        component:() => import(/* webpackChunkName: "accountedit" */ '@/views/task/Accountedit.vue')
      },
      //任务管理 end

      {
        path:'/matlibrary',
        name:'matlibrary',
        component:() => import(/* webpackChunkName: "matlibrary" */ '@/views/Matlibrary.vue')
      },
      {
        path:'/collibrary',
        name:'collibrary',
        component:() => import(/* webpackChunkName: "collibrary" */ '@/views/Collibrary.vue')
      },
      {
        path:'/tasklog',
        name:'tasklog',
        component:() => import(/* webpackChunkName: "tasklog" */ '@/views/Tasklog.vue')
      },
      {
        path:'/trafficquery',
        name:'trafficquery',
        component:() => import(/* webpackChunkName: "trafficquery" */ '@/views/Trafficquery.vue')
      },
      {
        path:'/platintroduction',
        name:'platintroduction',
        component:() => import(/* webpackChunkName: "platintroduction" */ '@/views/Platintroduction.vue')
      }
    ]
  },
]

const router = new VueRouter({
  mode:'history',
  routes
})


export default router
