<template>
  <section>
    <div v-if="appLoading"
      class="fixed inset-0 z-50 w-full h-full bg-white/99 flex items-center justify-center"
    >
      <loading />
    </div>
    <div v-else>
      <template v-if="isLoggedIn">
        <header-component />

        <!-- Layout: sidebar (navigation) + main content -->
        <div class="flex">
          <navigation-component />

          <main class="flex-1 maxo-simple-cms-background">
            <router-view @login-success="handleLogin" />
          </main>
        </div>
      </template>

      <template v-else>
        <main class="maxo-simple-cms-background">
          <router-view @login-success="handleLogin" />
        </main>
      </template>
    </div>

  </section>
</template>

<script lang="ts" setup>
// 3rd party libs
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Inc
import { apiAuthenticate } from '@src/inc/api';
import { setIsLoggedIn, isLoggedIn } from '@src/inc/user';

// Utilities
import { functions } from '@src/utils/functions';

// Components
import loading from '@src/components/loading.vue';
import headerComponent from '@src/components/header.vue';
import navigationComponent from '@src/components/navigation.vue';

const route = useRoute();
const router = useRouter();

const appLoading = ref(true);

onMounted(async () => {
  if (functions.storage('get', 'token')) {
    await handleLogin();
  }

  appLoading.value = false;
});

async function handleLogin() {
  const token = functions.storage('get', 'token');

  // If token is present
  if (token) {
    // We set it as default header for axios
    axios.defaults.headers.common.sessionToken = token;

    const authenticationResponse = await apiAuthenticate();

    if (authenticationResponse.status) {
      // We additionaly check if user is on login page
      if (route.path === '/') {
        // If so, we redirect him to profile page
        router.push('/profile');
      }
    }
  } else {
    setIsLoggedIn(false);

    // If user is not logged in, we redirect him to login page
    if (route.path !== '/' && route.path !== '/404') {
      router.push('/');
    }
  }

  // in app.vue
  //router.push('/profile');
}
</script>