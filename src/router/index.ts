import { createMemoryHistory, createRouter } from 'vue-router'
import {routes} from '@/router/routes.ts'


export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})