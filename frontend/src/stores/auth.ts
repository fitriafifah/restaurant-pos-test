// src/stores/auth.ts
import { create } from 'zustand';
import api from '../lib/api';

type Role = 'pelayan' | 'kasir';
type User = { id: number; name: string; role: Role };

type AuthState = {
  user: User | null;
  token: string | null;
  login: (payload: { user: User; access_token: string }) => void;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: ({ user, access_token }) => {
    localStorage.setItem('access_token', access_token);
    set({ user, token: access_token });
  },
  logout: async () => {
    try {
      await api.post('/logout');
    } catch {}
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },
}));
