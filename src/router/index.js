import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { authForbidden: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { authForbidden: true }
  },
  {
    path: '/qrauth',
    name: 'QRAuth',
    component: () => import('../views/QRAuth.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/password-recover',
    name: 'PasswordRecover',
    component: () => import('../views/PasswordRecover.vue'),
    meta: { authForbidden: true }
  },
  {
    path: '/email-confirmation',
    name: 'EmailConfirm',
    component: () => import('../views/EmailConfirm.vue'),
    meta: { authForbidden: true }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  
  let auth = store._vm.isAuth
  
  if (await to.matched.some(record => record.meta.requiresAuth)) {

    if (!auth) {
      console.log({auth})
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
