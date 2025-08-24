import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import UsersView from '@/views/UsersView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'User Registration'
      }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: {
        title: 'User Management'
      }
    }
  ]
});

// Update page title based on route
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - User Registration System`;
  }
  next();
});

export default router;
