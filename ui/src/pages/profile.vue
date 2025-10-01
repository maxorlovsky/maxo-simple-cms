<template>
  <section class="flex items-center justify-center min-h-screen px-4">
    <div class="w-full max-w-lg bg-white rounded-md shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">
        Profile
      </h2>

      <form class="space-y-4"
        @submit.prevent="submitForm"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Admin ID</label>
            <div class="mt-1 text-sm text-gray-900">
              {{ user?.id ?? '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Admin Name</label>
            <div class="mt-1 text-sm text-gray-900">
              {{ user?.login ?? '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Admin Level</label>
            <div class="mt-1 text-sm text-gray-900">
              {{ user?.level ?? '-' }}
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Password</label>
            <input v-model="form.currentPass"
              type="password"
              class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">New Password</label>
            <input v-model="form.newPass"
              type="password"
              class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Repeat New Password</label>
            <input v-model="form.repeatPass"
              type="password"
              class="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <div v-if="error.display"
          class="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded"
        >
          {{ error.message }}
        </div>

        <div v-if="success.display"
          class="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded"
        >
          {{ success.message }}
        </div>

        <div class="flex justify-end">
          <button type="submit"
            :disabled="formLoading || submitDisabled"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:opacity-50"
          >
            <svg v-if="formLoading"
              class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Save
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
// 3rd party libs
import { ref, reactive, computed } from 'vue';
import axios from 'axios';

import { routes, apiUrl } from '@src/inc/config';

const formLoading = ref(false);
const form = reactive({
  currentPass: '',
  newPass: '',
  repeatPass: ''
});
const error = reactive({
  display: false,
  message: ''
});
const success = reactive({
  display: false,
  message: ''
});

const submitDisabled = computed(() => !form.currentPass || !form.newPass || !form.repeatPass || form.newPass.length < 6 || form.newPass !== form.repeatPass);

async function submitForm() {
  formLoading.value = true;
  error.display = false;
  success.display = false;

  try {
    const response = await axios.put(`${apiUrl}/user-data/change-password`, {
      currentPass: form.currentPass,
      newPass: form.newPass,
      repeatPass: form.repeatPass
    });

    success.display = true;
    success.message = response.data.message || 'Password updated';

    form.currentPass = '';
    form.newPass = '';
    form.repeatPass = '';
  } catch (err: any) {
    error.display = true;
    error.message = err?.response?.data?.message || 'Server error';
  } finally {
    formLoading.value = false;
  }
}
</script>

<script lang="ts">
export default {};

routes.push({
  path: '/profile',
  component: () => import('./profile.vue'),
  meta: {
    title: 'Profile',
  }
});
</script>