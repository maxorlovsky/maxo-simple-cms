// 3rd party libs
import axios from 'axios';

// Inc
import { apiUrl } from './config';

// Interfaces
import type { LoginRequestInterface, LoginResponseInterface } from '@shared/interfaces/login';

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