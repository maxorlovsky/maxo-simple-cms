// 3rd party libs
import axios from 'axios';
import { ref } from 'vue';

// Inc
import router from '@src/router';
import { apiUrl } from './config';
import { apiAuthenticate } from './api';

// Utilities
import { functions } from '@src/utils/functions';

// Interfaces
import { AdminInterface } from '@shared/interfaces/admins';

export const isLoggedIn = ref(false);

export function setIsLoggedIn(value: boolean) {
  isLoggedIn.value = value;
}

export const userData = ref(null);

export function setUserData(value: AdminInterface) {
  userData.value = value;
}

export async function logout() {
  // We trigger API call, but don't care about response
  try {
    await axios.post(`${apiUrl}/private/logout`);
    // eslint-disable-next-line
  } catch (error) {}

  // Removing default header
  delete axios.defaults.headers.common.sessionToken;

  // Removing token from local storage
  functions.storage('remove', 'token');

  // Setting user as logged out
  isLoggedIn.value = false;
  userData.value = null;

  // Redirect to login page
  router.push('/');
}

export async function authorization(token: string): Promise<any> {
  try {
    // Add JWT token as default header
    axios.defaults.headers.common.sessionToken = token;

    await apiAuthenticate();
  } catch (error) {
    console.error('Error fetching resources: ' + error);
  }
};