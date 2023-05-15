import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory,
} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../pages/home.vue'),
  },
  {
    path: '/list',
    component: () => import('../pages/list.vue'),
  },
  {
    path: '/detail',
    component: () => import('../pages/detail.vue'),
  },
  {
    path: '/en',
    component: () => import('../pages/home.vue'),
  },
  {
    path: '/en/list',
    component: () => import('../pages/list.vue'),
  },
  {
    path: '/en/detail',
    component: () => import('../pages/detail.vue'),
  },
]

const router = _createRouter({
  history: import.meta.env.SSR
    ? createMemoryHistory('/')
    : createWebHistory('/'),
  routes,
})

export const createRouter = () => {
  return router
}
