import { createRouter, createWebHistory } from 'vue-router'
import JobsPage from '../components/JobsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: JobsPage,
    },
  ],
})

export default router
