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
  role: Role | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // ✅ 加上初始化狀態
  login: (role: Role) => void;
  logout: () => void;
  initFromServer: () => Promise<void>;
  hasPermission: (action: keyof Permissions) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  role: null,
  isAuthenticated: false,
  isInitialized: false, // ✅ 初始為 false

  login: (role) => set({
    role,
    isAuthenticated: true,
    isInitialized: true, // ✅ 登入時也設為 true
  }),

  logout: () => set({
    role: null,
    isAuthenticated: false,
    isInitialized: true, // ✅ 登出時也設為 true
  }),

  initFromServer: async () => {
    try {
      const { role } = await getCurrentUser();
      set({ role, isAuthenticated: true, isInitialized: true });
    } catch (err) {
      set({ role: null, isAuthenticated: false, isInitialized: true });
    }
  },

  hasPermission: (action) => {
    const role = get().role;
    if (!role) return false;
    return rolePermissions[role][action];
  },
}));
