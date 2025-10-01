// 3rd party libs
import axios from 'axios';
import { ref } from 'vue';

// Inc
import { apiUrl, multiBrands } from './config';

export const isLoggedIn = ref(false);

export function setIsLoggedIn(value: boolean) {
  isLoggedIn.value = value;
}

export const userData = ref(null);

export function setUserData(value: boolean) {
  userData.value = value;
}

export async function authorization(value: any): Promise<any> {
  try {
    // Add JWT token as default header
    axios.defaults.headers.common.sessionToken = value.token;

    const axiosEndpoints = [axios.get(`${apiUrl}/me`)];

    // In case website need to support multibrands, run mutlisite API call as well
    if (multiBrands) {
      axiosEndpoints.push(axios.get(`${apiUrl}/multisite`));
    }

    const response = await axios.all(axiosEndpoints);

    // Specifying as loggedIn, to check info in router beforeEach
    isLoggedIn.value = true;

    // Saving user data
    userData.value = response[0].data;

    // Saving multisite data
    if (multiBrands) {
      //context.commit('saveMultiSite', response[1].data);
    }
  } catch (error) {
    console.error('Error fetching resources: ' + error);

    // Triggering the logout
  }
};