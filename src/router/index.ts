import { createRouter, createWebHistory } from 'vue-router'
import WriteJsonInfo from '../views/WriteJsonInfo.vue'
import CompareResult from '../views/CompareResult.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WriteJsonInfo
    },
    {
      path: '/record',
      name: 'result',
      component: CompareResult
    }
  ]
})

export default router
