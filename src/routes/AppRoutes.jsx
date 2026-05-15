/* ============================================== */
/*  APP ROUTERS */
/* ============================================== */

import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Hotels from "../pages/Hotels";
import HotelDetail from "../pages/HotelDetail";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";
import ManagerDashboard from "../pages/ManagerDashboard";
import AdminHotels from "../pages/AdminHotels";
import AdminUsers from "../pages/AdminUsers";
import AdminHotelDetail from "../pages/AdminHotelDetail";

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
      <Route path="/admin" element={<Navigate to="/admin/hotels" replace />} />
      <Route path="/admin/hotels" element={<AdminHotels />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/hotels/:hotelId" element={<AdminHotelDetail />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
