// 3rd party libs
import axios from 'axios';

// Inc
import { apiUrl } from './config';
import { setNavigationMenu } from './store';
import { setIsLoggedIn, setUserData } from './user';

// Interfaces
import type { LoginRequestInterface, LoginResponseInterface, MeResponseInterface } from '@shared/interfaces/login';
import { PermissionInterface } from '@shared/interfaces/permissions';
import { GeneralResponseInterface } from '@shared/interfaces/general';

export async function apiLogin(attributes: LoginRequestInterface): Promise<LoginResponseInterface> {
  let data: LoginResponseInterface = null;

  try {
    const response = await axios.post(`${apiUrl}/login`, attributes as LoginRequestInterface);

    data = response.data;
  } catch (error: any) {
    data = error.response.data;
  }

  return data;
};

// We try to authenticate user and return true/false to consider if we should kick them out
export async function apiAuthenticate(): Promise<MeResponseInterface> {
  try {
    const response = await axios.get(`${apiUrl}/private/me`);
    const data = response.data as MeResponseInterface;

    setIsLoggedIn(data.status);
    setUserData(data.user);

    return {
      status: data.status,
      user: data.user
    };
    // eslint-disable-next-line
  } catch (error) {
    // Silence
  }

  return {
    status: false,
  };
}

// We try to authenticate user and return true/false to consider if we should kick them out
export async function apiFetchMenu(): Promise<boolean> {
  try {
    const response = await axios.get(`${apiUrl}/private/menu`);

    setNavigationMenu(response.data);

    return true;
  } catch (error) {
    console.error('Error, during fetching menu data from the server', error);
  }

  return false;
}

export async function apiFetchPermissions(): Promise<PermissionInterface[]> {
  try {
    const response = await axios.get(`${apiUrl}/private/permissions`);

    return response.data.data || [];
  } catch (error) {
    console.error('Error, during fetching menu data from the server', error);
  }

  return [];
}

export async function apiPutPermissions(permissions: PermissionInterface[]): Promise<GeneralResponseInterface> {
  try {
    const response = await axios.put(`${apiUrl}/private/permissions`, permissions);
    const data: GeneralResponseInterface = response.data;

    if (!data.status) {
      console.error(data.message);

      return data;
    }

    // On success we trigger to re-fetch menu
    await apiFetchMenu();

    return {
      status: true,
    };
  } catch (error) {
    console.error('Error, during fetching menu data from the server', error);
  }

  return {
    status: false,
    message: 'Could not update permissions due to server error'
  };
}