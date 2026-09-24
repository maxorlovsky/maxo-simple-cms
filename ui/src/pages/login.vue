<template>
  <section class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md rounded-md shadow-lg bg-white overflow-hidden">
      <header class="flex items-center justify-center py-16">
        <div class="rounded-full bg-gray-100 p-6 inline-flex items-center justify-center">
          <div class="w-16 h-16 bg-center bg-no-repeat">
            <img :src="'/assets/images/logo.png'"
              class="w-full h-full object-contain"
            >
          </div>
        </div>
      </header>

      <form class="px-6 pb-6"
        @submit.prevent="submitForm()"
      >
        <div class="space-y-4">
          <div>
            <label for="login"
              class="block text-sm font-medium text-gray-700"
            >Login</label>
            <input id="login"
              v-model="form.login"
              type="text"
              name="login"
              placeholder="Enter login"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <div>
            <label for="password"
              class="block text-sm font-medium text-gray-700"
            >Password</label>
            <div class="relative mt-1">
              <input id="password"
                v-model="form.password"
                :type="visible ? 'text' : 'password'"
                name="password"
                placeholder="Enter password"
                class="block w-full pr-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <button type="button"
                class="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500 focus:outline-none"
                @click="visible = !visible"
              >
                <span v-if="visible">Hide</span>
                <span v-else>Show</span>
              </button>
            </div>
          </div>

          <div v-if="error.display"
            class="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded"
          >
            {{ error.message }}
          </div>

          <div class="flex justify-end">
            <button type="submit"
              :disabled="buttonLoading"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:opacity-50"
            >
              <svg v-if="buttonLoading"
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
              Login
            </button>
          </div>
        </div>
      </form>

      <footer class="bg-gray-800 text-center text-sm text-gray-300 py-3">
        <a href="https://maxorlovsky.com"
          target="_blank"
        >Version: {{ version }} <span>&copy;</span> 2011-{{ year }}</a>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
// 3rd party libs
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

// Inc
import { version, routes } from '@src/inc/config';
import { apiLogin } from '@src/inc/api';

// Utils
import { functions } from '@src/utils/functions';

const router = useRouter();

const buttonLoading = ref(false);
const form = reactive({
  login: '',
  password: ''
});
const error = reactive({
  display: false,
  message: ''
});
const visible = ref(false);
const year = ref(new Date().getFullYear());

async function submitForm() {
  buttonLoading.value = true;
  error.display = false;
  error.message = '';

  const loginResponse = await apiLogin({
    login: form.login,
    password: form.password,
  });

  // If response returned error
  if (!loginResponse || !loginResponse?.status) {
    error.display = true;

    if (loginResponse.message) {
      error.message = loginResponse.message;
    } else {
      error.message = 'Server returned error';
    }

    buttonLoading.value = false;

    return;
  }

  // Otherwise we need to login
  // Save session token into local storage
  // 7 days
  functions.storage('set', 'token', loginResponse.sessionToken, 604800000);

  router.push('/profile');
}
</script>

<script lang="ts">
export default {
  name: 'login',
};

routes.push({
  path: '/',
  component: () => import('./login.vue'),
  meta: {
    title: 'Login Page'
  }
});
</script>