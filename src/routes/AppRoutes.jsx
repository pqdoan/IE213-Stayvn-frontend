// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
// import ManagerLayout from "../layouts/ManagerLayout";
// import AdminLayout from "../layouts/AdminLayout";

// import Home from "../pages/Home";
// import Hotels from "../pages/Hotels";
// import HotelDetail from "../pages/HotelDetail";
// import Booking from "../pages/Booking";
// import MyBookings from "../pages/MyBookings";
// import ManagerDashboard from "../pages/ManagerDashboard";
// import AdminPanel from "../pages/AdminPanel";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* USER */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/hotels" element={<Hotels />} />
//           <Route path="/hotel/:id" element={<HotelDetail />} />
//           <Route path="/booking" element={<Booking />} />
//           <Route path="/my-bookings" element={<MyBookings />} />
//         </Route>

//         {/* MANAGER */}
//         <Route element={<ManagerLayout />}>
//           <Route path="/manager" element={<ManagerDashboard />} />
//         </Route>

//         {/* ADMIN */}
//         <Route element={<AdminLayout />}>
//           <Route path="/admin" element={<AdminPanel />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
