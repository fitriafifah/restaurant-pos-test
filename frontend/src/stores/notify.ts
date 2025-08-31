// src/stores/notify.ts
import { create } from 'zustand';

type Sev = 'success' | 'error' | 'info' | 'warning';

type NotifyState = {
  open: boolean;
  message: string;
  severity: Sev;
  show: (msg: string, severity?: Sev) => void;
  close: () => void;
};

export const useNotify = create<NotifyState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  show: (message, severity = 'info') =>
    set({ open: true, message, severity }),
  close: () => set({ open: false }),
}));
