// src/api/authApi.ts
import apiService from './apiService';
import { AUTH_LOGIN_ROUTE, AUTH_ME_ROUTE } from '@/config/constants';
import camelcaseKeys from 'camelcase-keys';

export async function loginWithCredentials(
  username: string,
  password: string
): Promise<{ role: 'admin' | 'viewer' }> {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  const res = await apiService.post(AUTH_LOGIN_ROUTE, form, {
    headers: {}, // ⚠️ 不設 Content-Type 讓瀏覽器自動處理 boundary
    withCredentials: true,
  });

  return camelcaseKeys(res as Record<string, unknown>, { deep: true }) as {
    role: 'admin' | 'viewer';
  };
}

export async function getCurrentUser(): Promise<{ role: 'admin' | 'viewer' }> {
  const res = await apiService.get(AUTH_ME_ROUTE, {
    withCredentials: true,
  });

  return camelcaseKeys(res as Record<string, unknown>, { deep: true }) as {
    role: 'admin' | 'viewer';
  };
}
