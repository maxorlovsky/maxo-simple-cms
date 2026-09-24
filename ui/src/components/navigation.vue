<template>
  <!-- Desktop sidebar: always visible on >= sm -->
  <aside class="hidden sm:block w-64 bg-white border-r h-screen overflow-auto">
    <nav class="p-4">
      <ul>
        <li v-for="item in navigationMenu"
          :key="item.url"
          class="mb-2 w-full"
        >
          <!-- simple link -->
          <div v-if="!item.sublinks">
            <template v-if="item.url">
              <router-link :to="item.url"
                :class="['w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500 cursor-pointer', isActive(item.url) ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium' : '']"
              >
                <span>{{ item.title }}</span>
              </router-link>
            </template>

            <template v-else>
              <div role="button"
                tabindex="0"
                class="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500 cursor-pointer"
              >
                <span class="text-gray-800">{{ item.title }}</span>
              </div>
            </template>
          </div>

          <!-- item with sublinks -->
          <div v-else>
            <button :class="['w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500 cursor-pointer', isItemActive(item) ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium' : '']"
              @click="toggleItem(item)"
            >
              <div class="flex items-center gap-3">
                <span>{{ item.title }}</span>
              </div>
              <span class="text-gray-500">{{ item.active ? '-' : '+' }}</span>
            </button>

            <ul v-if="item.active"
              class="mt-2 ml-4"
            >
              <li v-for="subitem in item.sublinks"
                :key="subitem.url"
              >
                <template v-if="subitem.url">
                  <router-link :to="subitem.url"
                    :class="['w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500', isActive(subitem.url) ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium' : '']"
                  >
                    <span>{{ subitem.title }}</span>
                  </router-link>
                </template>

                <template v-else>
                  <div role="button"
                    tabindex="0"
                    class="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500 cursor-pointer"
                  >
                    <span class="text-gray-700">{{ subitem.title }}</span>
                  </div>
                </template>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Mobile overlay sidebar: controlled by isMobileOpen -->
  <div v-if="isMobileOpen"
    class="sm:hidden fixed inset-0 z-40"
  >
    <div class="fixed inset-0 bg-black/40"
      @click="setIsMobileOpen(false)"
    />

    <aside class="fixed left-0 top-0 w-64 bg-white h-full border-r z-50 overflow-auto">
      <nav class="p-4">
        <!-- keep a close control for mobile -->
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-semibold">
            Navigation
          </h3>
        </div>

        <ul>
          <li v-for="item in navigationMenu"
            :key="item.url"
            class="mb-2 w-full"
          >
            <div v-if="!item.sublinks">
              <template v-if="item.url">
                <router-link :to="item.url"
                  :class="['w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500', isActive(item.url) ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium' : '']"
                  @click="setIsMobileOpen(false)"
                >
                  <span>{{ item.title }}</span>
                </router-link>
              </template>

              <template v-else>
                <div role="button"
                  tabindex="0"
                  class="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500 cursor-pointer"
                  @click="setIsMobileOpen(false)"
                >
                  <span class="text-gray-800">{{ item.title }}</span>
                </div>
              </template>
            </div>

            <div v-else>
              <button :class="['w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500 cursor-pointer', isItemActive(item) ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium' : '']"
                @click="toggleItem(item)"
              >
                <div class="flex items-center gap-3">
                  <span>{{ item.title }}</span>
                </div>
                <span class="text-gray-500">{{ item.active ? '-' : '+' }}</span>
              </button>

              <ul v-if="item.active"
                class="mt-2 ml-4"
              >
                <li v-for="subitem in item.sublinks"
                  :key="subitem.url"
                >
                  <template v-if="subitem.url">
                    <router-link :to="subitem.url"
                      :class="['w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500', isActive(subitem.url) ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium' : '']"
                      @click="setIsMobileOpen(false)"
                    >
                      <span>{{ subitem.title }}</span>
                    </router-link>
                  </template>

                  <template v-else>
                    <div role="button"
                      tabindex="0"
                      class="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-500 cursor-pointer"
                      @click="setIsMobileOpen(false)"
                    >
                      <span class="text-gray-700">{{ subitem.title }}</span>
                    </div>
                  </template>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
// 3rd party libs
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Inc
import { isMobileOpen, setIsMobileOpen, navigationMenu } from '@src/inc/store';
import { apiFetchMenu } from '@src/inc/api';

const route = useRoute();

// Fetch menu when component is created/mounted
onMounted(async () => {
  // Keep the original behavior of dispatching fetchMenu
  await apiFetchMenu();

  // Set initial active flags based on current route
  setActiveFromRoute();
});

// Watch for menu or route changes and update active flags
watch([navigationMenu, () => route.path], () => {
  setActiveFromRoute();
});

function setActiveFromRoute() {
  if (!navigationMenu.value) return;

  // replicate original logic: take the first segment of the path
  const path = `/${route.path.split('/')[1]}`;

  // Only trigger this when menu is available
  for (const item of navigationMenu.value) {
    if (item.sublinks) {
      const findPath = item.sublinks.find((sublink: any) => sublink.url === path);

      if (findPath) {
        item.active = true;
      } else {
        // clear active if not matching (keeps UI in sync)
        item.active = false;
      }
    }
  }
}

function toggleItem(item: any) {
  item.active = !item.active;
}

// New helpers for active link styling
function isActive(url: string) {
  if (!url) return false;
  try {
    return route.path === url || route.path.startsWith(url + '/') || route.path.startsWith(url);
    // eslint-disable-next-line
  } catch (error) {
    return false;
  }
}

function isItemActive(item: any) {
  if (!item) return false;

  if (item.sublinks && Array.isArray(item.sublinks)) {
    return item.sublinks.some((s: any) => isActive(s.url));
  }

  return isActive(item.url);
}
</script>

<style scoped>
/* SCSS left-side styles replaced by Tailwind utilities inside template. */
</style>