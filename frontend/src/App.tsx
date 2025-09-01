// src/App.tsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import TablesWithDetailPage from "./pages/TablesWithDetailPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage";
import OrderListPage from "./pages/OrderListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Daftar meja + detail order di sebelahnya */}
        <Route path="/" element={<TablesWithDetailPage />}>
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Halaman login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Master Menu */}
        <Route path="/menu" element={<MenuPage />} />

        {/* Orders list */}
        <Route path="/orders" element={<OrderListPage />} />
      </Route>
    </Routes>
  );
}
