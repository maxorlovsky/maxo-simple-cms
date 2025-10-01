// 3rd party libs
import { createRouter, createWebHistory } from 'vue-router';

// Inc/Config
import { routes } from '@src/inc/config';
import { isLoggedIn } from '@src/inc/user';

// Utils
//import { apiAuthenticate } from '@utils/api';

// Pages
import '@src/pages/login.vue';
import '@src/pages/404.vue';
import '@src/pages/profile.vue';

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
  // Check if authentication verification is needed
  if (!isLoggedIn.value) {
    // In case user is not logged in, we first try to authenticate him
    /*const authenticationResponse = await apiAuthenticate();

    // If authentication failed, we need to redirect to the home page
    if (!authenticationResponse) {
        console.error('Authentication failure');

        // If not logged in, we need to redirect to the home page
        return next('/');
    }*/

    // We second check if now user is logged in, this should not happen, as otherwise authentication should fail in the first place, but we safeguard it
    if (!isLoggedIn.value) {
      console.error('Authentication failure (2)');

      // If not logged in, we need to redirect to the home page
      if (to.path !== '/' && to.path !== '/404') {
        return next('/');
      }
    }
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