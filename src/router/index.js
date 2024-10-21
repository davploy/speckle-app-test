import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useSpeckleStore } from '@/stores/index' // Adjust the path as necessary


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },

  ],
})

router.beforeEach(async (to, from, next) => {
  const store = useSpeckleStore()

  if (to.query.access_code) {
    // If the route contains an access code, exchange it
    try {
      await store.exchangeAccessCode(to.query.access_code)
    } catch (err) {
      console.warn("exchange failed", err)
    }
    // Whatever happens, go home.
    next("/")
  } else {
    try {
      // Check on every route change if you still have access.
      var goto = await store.getUser()
      next(goto)
    } catch (err) {
      next("/")
    }
  }
})

export default router


