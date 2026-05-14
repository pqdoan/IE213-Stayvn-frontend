import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ManagerLayout from "../layouts/ManagerLayout";
import ManagerDashboard from "../pages/ManagerDashboard";
import ManagerHotels from "../pages/ManagerHotels";
import ManagerRooms from "../pages/ManagerRooms";
import ManagerBookings from "../pages/ManagerBookings";
import ManagerServices from "../pages/ManagerServices";
import ManagerHotelInfo from "../pages/ManagerHotelInfo";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Hotels from "../pages/Hotels";
import HotelDetail from "../pages/HotelDetail";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";
import AdminPanel from "../pages/AdminPanel";


const AppRoutes = () => {
  return (
    <Routes>

      {/* MAIN LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route element={<ManagerLayout />}>
          <Route path="hotel-manager" element={<ManagerHotels />} />
          <Route path="hotel-manager/:hotelId" element={<ManagerDashboard />} />
          <Route path="hotel-manager/:hotelId/rooms" element={<ManagerRooms />} />
          <Route path="hotel-manager/:hotelId/bookings" element={<ManagerBookings />} />
          <Route path="hotel-manager/:hotelId/services" element={<ManagerServices />} />
          <Route path="hotel-manager/:hotelId/info" element={<ManagerHotelInfo />} />
        </Route>
      </Route>

      {/* MANAGER LAYOUT */}
      

      {/* ADMIN */}
      <Route path="/admin" element={<AdminPanel />} />

      {/* AUTH */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  );
};

export default AppRoutes;
