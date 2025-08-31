// src/lib/api.ts
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // contoh: http://localhost:8000/api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === Helper: ambil pesan error Laravel (422/500) ===
export function getErrorMessage(err: unknown): string {
  const ax = err as AxiosError<any>;
  if (!ax?.response) return (ax?.message ?? 'Network error');

  const data = ax.response.data;
  if (data?.message && !data?.errors) return String(data.message);

  // Laravel validation: { errors: { field: ["msg", ...], ... } }
  if (data?.errors) {
    const first = Object.values(data.errors)[0] as any;
    if (Array.isArray(first) && first.length) return first[0];
  }
  return `Error ${ax.response.status}`;
}

// === Auto redirect saat token invalid ===
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      // bisa tambahkan pesan query biar tau expired
      window.location.href = '/login?expired=1';
    }
    return Promise.reject(err);
  }
);

// === Download PDF helper ===
export async function downloadPdf(url: string, filename: string) {
  const res = await api.get(url, { responseType: 'blob' });
  const blob = new Blob([res.data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export default api;
