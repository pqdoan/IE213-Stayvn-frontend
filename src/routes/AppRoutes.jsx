/* ============================================== */
/*  APP ROUTERS */
/* ============================================== */

import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Hotels from "../pages/Hotels";
import HotelDetail from "../pages/HotelDetail";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";
import ManagerDashboard from "../pages/ManagerDashboard";
import AdminPanel from "../pages/AdminPanel";

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotel/:id" element={<HotelDetail />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/admin" element={<AdminPanel />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
