<template>
  <section>
    <div v-if="appIsLoading"
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
            <router-view />
          </main>
        </div>
      </template>

      <template v-else>
        <main class="maxo-simple-cms-background">
          <router-view />
        </main>
      </template>
    </div>

  </section>
</template>

<script lang="ts" setup>
// 3rd party libs
import { onMounted, ref } from 'vue';

// Inc
import { isLoggedIn } from '@src/inc/user';

// Components
import loading from '@src/components/loading.vue';
import headerComponent from '@src/components/header.vue';
import navigationComponent from '@src/components/navigation.vue';

const appIsLoading = ref(true);

onMounted(async () => {
  appIsLoading.value = false;
});
</script>