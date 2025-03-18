import { Routes, Route } from "react-router-dom";

import AdminHome from "./pages/Admin/Adminhome";
import ManageRestaurants from "./pages/Admin/ManageRestaurants";
import AuditLogs from "./pages/Admin/AuditLogs";
import ManageUsers from "./pages/Admin/ManageUsers";
import Dashboard from "./pages/Admin/Dashboard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import RestaurantPage from "./pages/Restaurant/RestaurantPage";
import RestaurantCreation from "./pages/Restaurant/RestaurantCreation";
import RestaurantAdminDashboard from "./pages/Restaurant/RestaurantAdminDashboard";
import RestaurantProfile from "./pages/Restaurant/RestaurantProfile";

import CartPage from "./pages/Cart/CartPage";

import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';  // Estilos principais
import 'primeicons/primeicons.css';  // Ícones


function App() {
  return (
      <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/manage-restaurants" element={<ManageRestaurants />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          <Route path="/restaurant" element={<RestaurantPage />} />
          <Route path="/restaurant/create" element={<RestaurantCreation />} />
          <Route path="/restaurant/dashboard" element={<RestaurantAdminDashboard />} />
          <Route path="/restaurant/profile" element={<RestaurantProfile />} />

          <Route path="/cart" element={<CartPage />} />
      </Routes>
  );
}

export default App;
