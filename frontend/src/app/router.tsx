import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import PublicTablesPage from '../pages/PublicTablesPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import MenuPage from '../pages/MenuPage';
import OrdersListPage from '../pages/OrderListPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import AuthGuard from './guards/AuthGuard';
import RoleGuard from './guards/RoleGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // 👥 Tamu (public)
      { index: true, element: <PublicTablesPage /> },

      // 🔐 Auth
      { path: 'login', element: <LoginPage /> },

      // 📊 Dashboard (semua role yang login)
      { path: 'dashboard', element: <AuthGuard><DashboardPage/></AuthGuard> },

      // 🍽️ Master Menu (khusus pelayan)
      {
        path: 'menu',
        element: (
          <AuthGuard>
            <RoleGuard role="pelayan">
              <MenuPage />
            </RoleGuard>
          </AuthGuard>
        )
      },

      // 🧾 Orders (semua role login bisa lihat)
      { path: 'orders', element: <AuthGuard><OrdersListPage/></AuthGuard> },

      // 📝 Detail Order (semua role login bisa lihat detail)
      { path: 'orders/:id', element: <AuthGuard><OrderDetailPage/></AuthGuard> },

      // 💰 Kasir Orders (opsional, kalau mau view khusus kasir)
      {
        path: 'kasir/orders',
        element: (
          <AuthGuard>
            <RoleGuard role="kasir">
              <OrdersListPage />
            </RoleGuard>
          </AuthGuard>
        )
      },
    ],
  },
]);
