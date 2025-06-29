import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import TicketList from '../components/tickets/TicketList.vue'
import TicketDetail from '../components/tickets/TicketDetail.vue'
import store from '../store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Tickets',
    component: TicketList,
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/:id',
    name: 'TicketDetail',
    component: TicketDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const userRole = store.getters['auth/userRole']

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAgent && userRole !== 'agent') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router