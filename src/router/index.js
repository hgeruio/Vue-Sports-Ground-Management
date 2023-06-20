import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/home',
    component: () => import('../pages/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../pages/Home.vue'),
      }, {
        path: '/area',
        name: 'area',
        component: () => import('../pages/Area.vue'),
      }, {
        path: '/data',
        name: 'data',
        component: () => import('../pages/Data.vue'),
      }, {
        path: '/fellow',
        name: 'fellow',
        component: () => import('../pages/Fellow.vue'),
      }, {
        path: '/employee',
        name: 'employee',
        component: () => import('../pages/Employee.vue'),
      }, {
        path: '/user',
        name: 'user',
        component: () => import('../pages/User.vue'),
      },

    ]
  }, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  mode: 'history'
})


/**
 * 全局前置要由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    // 登录或者注册才可以往下进行
    next()
  } else {
    // 获取 token
    const token = localStorage.getItem('token')
    const userval = $cookies.get('userval')
    // token 不存
    if (token === null || token === '' || userval == null || userval == '') {
      ElMessage.error('您还没有登录，请先登录')
      localStorage.getItem('token') = '',
        $cookies.get('userval') = ''
      next('/')
    } else {
      next()
    }
  }
})




export default router