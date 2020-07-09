import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

// 拦截路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // form 代表从那个路径跳转而来
  // next 是一个函数,表示放行
  // next() 放行 next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token跳转到登录页面
  if (!tokenStr) return next('/login')
  // 有token直接放行
  next()
})

export default router
