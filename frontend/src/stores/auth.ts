// src/stores/auth.ts
import { create } from 'zustand';
import api from '../lib/api';

type Role = 'pelayan' | 'kasir';
type User = { id: number; name: string; role: Role };

type AuthState = {
  user: User | null;
  token: string | null;
  login: (payload: { user: User; token: string }) => void;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null, token: null,
  login: ({ user, token }) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: async () => {
    try { await api.post('/logout'); } catch {}
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));
