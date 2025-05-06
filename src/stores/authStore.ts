import { create } from 'zustand';
import { getCurrentUser } from '@/api/authApi';

type Role = 'admin' | 'viewer';

interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
  canUpload: boolean;
}

const rolePermissions: Record<Role, Permissions> = {
  admin: {
    canEdit: true,
    canDelete: true,
    canUpload: true,
  },
  viewer: {
    canEdit: false,
    canDelete: false,
    canUpload: false,
  },
};

interface AuthState {
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (token: string, role: Role) => void;
  logout: () => void;
  initFromLocal: () => Promise<void>;
  hasPermission: (action: keyof Permissions) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  role: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (token, role) => {
    localStorage.setItem('access_token', token);
    set({ accessToken: token, role, isAuthenticated: true, isInitialized: true });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ accessToken: null, role: null, isAuthenticated: false, isInitialized: true });
  },

  initFromLocal: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    // 設 token（給 apiService 調用時可以抓到）
    set({ accessToken: token });

    try {
      const { role } = await getCurrentUser(); // ✅ 呼叫 /auth/me
      set({ role, isAuthenticated: true, isInitialized: true });
    } catch {
      // token 無效，清除
      localStorage.removeItem('access_token');
      set({ accessToken: null, role: null, isAuthenticated: false, isInitialized: true });
    }
  },

  hasPermission: (action) => {
    const role = get().role;
    if (!role) return false;
    return rolePermissions[role][action];
  },
}));
