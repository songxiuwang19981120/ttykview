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
      //设备管理 start
      {
        path:'/equsituation',
        name:'equsituation',
        component:() => import(/* webpackChunkName: "equsituation" */ '@/views/equipment/EquipmentSituation.vue'),

        //设备情况 详情
        children:[
          {
            path:'/equsituation/:id',
            name:'equsituationdetail',
            component:() => import(/* webpackChunkName: "equgroup" */ '@/components/equipmentCom/EquiDetail.vue')
          },
        ]
      },
      {
        path:'/equgroup',
        name:'equgroup',
        component:() => import(/* webpackChunkName: "equgroup" */ '@/views/equipment/EquipmentGroup.vue')
      },
      //设备管理 end


      //账号管理 start
      {
        path:'/accsituation',
        name:'accsituation',
        component:() => import(/* webpackChunkName: "accsituation" */ '@/views/account/AccountSituation.vue'),
        //账号情况 详情
        children:[
          {
            path:'/accsituation/:id',
            name:'accdetail',
            component:() => import(/* webpackChunkName: "accdetail" */ '@/components/equipmentCom/EquiDetail.vue')
          },
        ]
      },
      {
        path:'/accclass',
        name:'accclass',
        component:() => import(/* webpackChunkName: "accclass" */ '@/views/account/AccountClass.vue')
      },
      //账号管理 end

      //任务管理 start
      {
        path:'/videorelease',
        name:'videorelease',
        component:() => import(/* webpackChunkName: "videorelease" */ '@/views/task/VideoRelease.vue')
      },
      {
        path:'/commentlike',
        name:'commentlike',
        component:() => import(/* webpackChunkName: "commentlike" */ '@/views/task/CommentLike.vue')
      },
      {
        path:'/follow',
        name:'follow',
        component:() => import(/* webpackChunkName: "follow" */ '@/views/task/Follow.vue')
      },
      {
        path:'/private',
        name:'private',
        component:() => import(/* webpackChunkName: "private" */ '@/views/task/PrivateLetter.vue')
      },
      //任务管理 end

      //素材管理 start
      {
        path:'/video',
        name:'video',
        component:() => import(/* webpackChunkName: "video" */ '@/views/Material/Video.vue'),
        children:[
          {
            path:'/video/:id',
            name:'videodetail',
            component:() => import(/* webpackChunkName: "videodetail" */ '@/components/materialCom/videoCom/VideoDetail.vue')
          },
        ]
      },
      {
        path:'/avartar',
        name:'avartar',
        component:() => import(/* webpackChunkName: "avartar" */ '@/views/Material/Avatar.vue')
      },
      {
        path:'/nikname',
        name:'nikname',
        component:() => import(/* webpackChunkName: "nikname" */ '@/views/Material/NikName.vue')
      },
      {
        path:'/autograph',
        name:'autograph',
        component:() => import(/* webpackChunkName: "autograph" */ '@/views/Material/Autograph.vue')
      },
      {
        path:'/label',
        name:'label',
        component:() => import(/* webpackChunkName: "label" */ '@/views/Material/Label.vue')
      },
      {
        path:'/fllow',
        name:'fllow',
        component:() => import(/* webpackChunkName: "fllow" */ '@/views/Material/NeedFollow.vue')
      },
      {
        path:'/letter',
        name:'letter',
        component:() => import(/* webpackChunkName: "letter" */ '@/views/Material/LetterMaterial.vue')
      },
      {
        path:'/theme',
        name:'theme',
        component:() => import(/* webpackChunkName: "theme" */ '@/views/Material/Theme.vue')
      },
      {
        path:'/videocapture',
        name:'videocapture',
        component:() => import(/* webpackChunkName: "videocapture" */ '@/views/VideoCapture.vue')
      },
      {
        path:'/usercapture',
        name:'usercapture',
        component:() => import(/* webpackChunkName: "usercapture" */ '@/views/UserCapture.vue')
      }
      //素材管理 end
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
