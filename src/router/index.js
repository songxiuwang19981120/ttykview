import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import store from 'store'
import base from '@/config/base.config'
import 'nprogress/nprogress.css'
const { TOKEN_NAME } = base
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};


const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Register.vue')
  },
  {
    path: '/analysis/:id?',
    name: 'analysis',
    component: () => import(/* webpackChunkName: "login" */ '@/views/accAnalysis/accAnalysis.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/LayOut.vue'),
    redirect: '/accsituation',
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "equgroup" */ '@/views/Index.vue'),
        meta: {
          title: '首页',
          icon: 'el-icon-s-home'
        }
      },
      //设备管理 start
      {
        path: '/equsituation',
        name: 'equsituation',
        component: () => import(/* webpackChunkName: "equsituation" */ '@/views/equipment/EquipmentSituation.vue'),
        meta: {
          title: '设备情况',
          icon: 'el-icon-mobile-phone',
        },
        //设备情况 详情
        children: [
          {
            path: '/equsituation/:id',
            name: 'equsituationdetail',
            component: () => import(/* webpackChunkName: "equgroup" */ '@/components/equipmentCom/EquiDetail.vue'),
          },
        ]
      },
      {
        path: '/equgroup',
        name: 'equgroup',
        component: () => import(/* webpackChunkName: "equgroup" */ '@/views/account/accGroup.vue'),
        meta: {
          title: '账号分组',
          icon: 'el-icon-receiving',
        }
      },
      //设备管理 end


      //账号管理 start
      {
        path: '/accsituation',
        name: 'accsituation',
        component: () => import(/* webpackChunkName: "accsituation" */ '@/views/account/accCountSit/AccountSituation.vue'),
        meta: {
          title: '账号情况',
          icon: 'el-icon-receiving',
        }
        //账号情况 详情
      },
      {
        path: '/accclass',
        name: 'accclass',
        component: () => import(/* webpackChunkName: "accclass" */ '@/views/account/acccountClass/AccountClass.vue'),
        meta: {
          title: '账号分类',
          icon: 'el-icon-receiving',
        }
      },
      //账号管理 end

      //任务管理 start
      {
        path: '/videorelease',
        name: 'videorelease',
        component: () => import(/* webpackChunkName: "videorelease" */ '@/views/task/VideoRelease.vue'),
        meta: {
          title: '视频发布',
          icon: 'el-icon-tickets',
        }
      },
      {
        path: '/commentlike',
        name: 'commentlike',
        component: () => import(/* webpackChunkName: "commentlike" */ '@/views/task/CommentLike.vue'),
        meta: {
          title: '评论区点赞',
          icon: 'el-icon-tickets',
        }
      },
      {
        path: '/follow',
        name: 'follow',
        component: () => import(/* webpackChunkName: "follow" */ '@/views/task/Follow.vue'),
        meta: {
          title: '关注',
          icon: 'el-icon-tickets',
        }
      },
      {
        path: '/private',
        name: 'private',
        component: () => import(/* webpackChunkName: "private" */ '@/views/task/PrivateLetter.vue'),
        meta: {
          title: '私信',
          icon: 'el-icon-tickets',
        }
      },
      {
        path: '/accountcreation',
        name: 'AccountCreation',
        component: () => import(/* webpackChunkName: "private" */ '@/views/task/AccountCreation.vue'),
        meta: {
          title: '账号创建',
          icon: 'el-icon-tickets',
        }
      },
      {
        path: '/cultivatetask',
        name: 'cultivatetask',
        component: () => import(/* webpackChunkName: "private" */ '@/views/task/CultivateTask.vue'),
        meta: {
          title: '养号任务',
          icon: 'el-icon-tickets',
        }
      },

      //任务管理 end

      //素材管理 start
      {
        path: '/video',
        name: 'video',
        component: () => import(/* webpackChunkName: "video" */ '@/views/Material/Video.vue'),
        meta: {
          title: '视频素材',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/avartar',
        name: 'avartar',
        component: () => import(/* webpackChunkName: "avartar" */ '@/views/Material/Avatar.vue'),
        meta: {
          title: '头像素材',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/nikname',
        name: 'nikname',
        component: () => import(/* webpackChunkName: "nikname" */ '@/views/Material/NikName.vue'),
        meta: {
          title: '账号昵称',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/autograph',
        name: 'autograph',
        component: () => import(/* webpackChunkName: "autograph" */ '@/views/Material/Autograph.vue'),
        meta: {
          title: '个人简介素材',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/label',
        name: 'label',
        component: () => import(/* webpackChunkName: "label" */ '@/views/Material/Label.vue'),
        meta: {
          title: '话题标签素材',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/fllow',
        name: 'fllow',
        component: () => import(/* webpackChunkName: "fllow" */ '@/views/Material/NeedFollow.vue'),
        meta: {
          title: '需关注ID素材',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/letter',
        name: 'letter',
        component: () => import(/* webpackChunkName: "letter" */ '@/views/Material/LetterMaterial.vue'),
        meta: {
          title: '私信素材',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/theme',
        name: 'theme',
        component: () => import(/* webpackChunkName: "theme" */ '@/views/Material/Theme.vue'),
        meta: {
          title: '作品文案',
          icon: 'el-icon-magic-stick',
        }
      },
      {
        path: '/videocapture',
        name: 'videocapture',
        component: () => import(/* webpackChunkName: "videocapture" */ '@/views/task/VideoCapture.vue'),
        meta: {
          title: '视频采集',
          icon: 'el-icon-tickets',
        }
      },
      {
        path: '/usercapture',
        name: 'usercapture',
        component: () => import(/* webpackChunkName: "usercapture" */ '@/views/task/UserCapture.vue'),
        meta: {
          title: '用户采集',
          icon: 'el-icon-tickets',
        }
      },
      //素材管理 end

      // 账户管理 start
      {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/Users.vue'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-user',
        }
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/Roles.vue'),
        meta: {
          title: '角色管理',
          icon: 'el-icon-user',
        }
      },
      // 账户管理 end
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
   if (to.path === '/login' || to.path === '/register') {
    NProgress.done()
    return next()
  }
  const token = store.get(TOKEN_NAME)
  if (!token) {
    NProgress.done()
    return next('/login')
  } 
  NProgress.done()
  next()
})

router.afterEach(() => {
  NProgress.done()
})



export default router
