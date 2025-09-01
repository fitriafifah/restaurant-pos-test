// src/routes/router.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PublicTablesPage from "../pages/PublicTablesPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MenuPage from "../pages/MenuPage";
import OrdersListPage from "../pages/OrderListPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import TablesWithDetailPage from "../pages/TablesWithDetailPage"; // <-- kita tambahin
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // 👥 Tamu (public) -> wrapper untuk meja + detail
      {
        path: "",
        element: <TablesWithDetailPage />, 
        children: [
          { path: "orders/:id", element: <AuthGuard><OrderDetailPage /></AuthGuard> },
        ],
      },

      // 🔐 Auth
      { path: "login", element: <LoginPage /> },

      // 📊 Dashboard
      { path: "dashboard", element: <AuthGuard><DashboardPage /></AuthGuard> },

      // 🍽️ Master Menu
      {
        path: "menu",
        element: (
          <AuthGuard>
            <RoleGuard role="pelayan">
              <MenuPage />
            </RoleGuard>
          </AuthGuard>
        ),
      },

      // 🧾 Orders (semua role login bisa lihat)
      { path: "orders", element: <AuthGuard><OrdersListPage /></AuthGuard> },

      // 💰 Kasir Orders (opsional)
      {
        path: "kasir/orders",
        element: (
          <AuthGuard>
            <RoleGuard role="kasir">
              <OrdersListPage />
            </RoleGuard>
          </AuthGuard>
        ),
      },
    ],
  },
]);
