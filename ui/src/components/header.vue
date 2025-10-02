<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <button aria-label="menu"
            class="mr-3 p-2 text-gray-600 hover:text-gray-900 lg:hidden"
            @click="burgerMenu"
          >
            <IconMenu class="w-6 h-6" />
          </button>

          <router-link to="/profile"
            class="flex items-center"
          >
            <img :src="'/assets/images/logo.png'"
              alt="logo"
              class="w-10 h-10 object-contain"
            >
            <span class="ml-3 text-lg font-semibold text-gray-800 hidden sm:inline">{{ projectName }}</span>
          </router-link>
        </div>

        <div class="flex items-center">
          <div class="hidden sm:flex sm:items-center sm:space-x-4">
            <router-link to="/profile"
              title="Profile"
              class="p-2 rounded-md text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              <IconUser class="w-5 h-5" />
            </router-link>

            <button title="Logout"
              class="p-2 rounded-md text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 cursor-pointer"
              @click="logout"
            >
              <IconLogout class="w-5 h-5" />
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="sm:hidden">
            <button aria-expanded="false"
              class="p-2 text-gray-600 hover:text-gray-900"
              @click="setIsMobileOpen(!isMobileOpen)"
            >
              <IconMenu v-if="!isMobileOpen"
                class="w-6 h-6"
              />
              <IconClose v-else
                class="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileOpen"
      class="sm:hidden"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link to="/profile"
          title="Profile"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
        >
          Profile
        </router-link>

        <button title="Logout"
          class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconMenu from '@src/components/icons/IconMenu.vue';
import IconClose from '@src/components/icons/IconClose.vue';
import IconUser from '@src/components/icons/IconUser.vue';
import IconLogout from '@src/components/icons/IconLogout.vue';

// Inc
import { logout } from '@src/inc/user';
import { projectName } from '@src/inc/config';
import { isMobileOpen, setIsMobileOpen } from '@src/inc/store';

function burgerMenu() {
  // Toggle drawer in store and also toggle mobile menu for small screens
  setIsMobileOpen(!isMobileOpen.value);
}
</script>