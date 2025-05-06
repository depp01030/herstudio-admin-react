import axiosInstance from './axiosInstance';
import { AUTH_LOGIN_ROUTE, AUTH_ME_ROUTE } from '@/config/constants';
import camelcaseKeys from 'camelcase-keys';

// ✅ 登入取得 accessToken + role
export async function loginWithCredentials(
  username: string,
  password: string
): Promise<{ accessToken: string; role: 'admin' | 'viewer' }> {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  const res = await axiosInstance.post(AUTH_LOGIN_ROUTE, form, {
    headers: {}, // 不加 Content-Type 讓瀏覽器自動帶上 multipart/form-data
  });

  return camelcaseKeys(res.data, { deep: true }) as {
    accessToken: string;
    role: 'admin' | 'viewer';
  };
}

// ✅ 驗證登入身份
export async function getCurrentUser(): Promise<{ role: 'admin' | 'viewer' }> {
  const res = await axiosInstance.get(AUTH_ME_ROUTE);
  return camelcaseKeys(res.data, { deep: true }) as {
    role: 'admin' | 'viewer';
  };
}
