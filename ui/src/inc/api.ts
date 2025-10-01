// 3rd party libs
import axios from 'axios';

// Inc
import { apiUrl } from './config';

interface LoginRequestInterface {
  login: string;
  password: string;
}

interface LoginResponseInterface {
  status: string;
  message: string;
  sessionToken: string;
}

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