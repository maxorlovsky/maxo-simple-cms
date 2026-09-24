// 3rd party libs
import { createRouter, createWebHistory } from 'vue-router';

// Inc/Config
import { routes } from '@src/inc/config';
import { authorization, isLoggedIn } from '@src/inc/user';

// Utilities
import { functions } from './utils/functions';

// Pages
import '@src/pages/login.vue';
import '@src/pages/404.vue';
import '@src/pages/profile.vue';
import '@src/pages/permissions.vue';

// 404 page
routes.push(
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  }
);

// Initiate the router
const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

// @ts-ignore
router.beforeEach(async (to, from, next) => {
  if (!isLoggedIn.value && functions.storage('get', 'token')) {
    await authorization(functions.storage('get', 'token'));
  }

  // We see if user is logged in, but try to access home page, then we redirect to profile
  if (isLoggedIn.value && to.path === '/') {
    return next('/profile');
  } else if (!isLoggedIn.value && to.path !== '/' && to.path !== '/404') {
    return next('/');
  }

  window.scrollTo(0, 0);

  if (to.meta.title) {
    document.title = to.meta.title as string;
  } else {
    document.title = 'Maxo Simple CMS';
  }

  return next();
});

export default router;