<template>
  <section class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-lg rounded-md shadow-lg bg-white overflow-hidden">
      <header class="flex items-center justify-center py-12">
        <div class="rounded-full bg-gray-100 p-6 inline-flex items-center justify-center">
          <div class="w-20 h-20 bg-center bg-no-repeat">
            <img :src="'/assets/images/logo.png'"
              class="w-full h-full object-contain"
            >
          </div>
        </div>
      </header>

      <main class="px-8 pb-12 text-center">
        <h1 class="text-6xl font-extrabold text-gray-900">
          404
        </h1>
        <p class="mt-4 text-lg text-gray-600">
          Page not found
        </p>
        <p class="mt-2 text-sm text-gray-500">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div class="mt-6">
          <router-link to="/"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
          >
            Go to Home
          </router-link>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
// Inc
import { routes } from '@src/inc/config';
</script>

<script lang="ts">
export default {
  name: '404',
};

routes.push({
  path: '/404',
  component: () => import('./404.vue'),
  meta: {
    title: '404 - Page not found',
  }
});
</script>