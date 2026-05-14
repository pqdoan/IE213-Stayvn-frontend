import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import ManagerSidebar from "../components/layout/ManagerSidebar";
import hotelService from "../services/hotelService";
import "../styles/HotelManager.css";

const ManagerLayout = () => {
  const { hotelId } = useParams();
  const location = useLocation();
  // hotelManagerService.getHotelById returns a promise; component should handle async fetch
  const [hotel, setHotel] = React.useState(null);
  const [loadingHotel, setLoadingHotel] = React.useState(Boolean(hotelId));

  React.useEffect(() => {
    let mounted = true;
    if (!hotelId) {
      setHotel(null);
      setLoadingHotel(false);
      return;
    }

    setLoadingHotel(true);
    hotelService.getHotelById(hotelId).then((h) => {
      if (mounted) setHotel(h);
    }).catch(() => {
      if (mounted) setHotel(null);
    }).finally(() => {
      if (mounted) setLoadingHotel(false);
    });

    return () => { mounted = false; };
  }, [hotelId]);

  if (hotelId && loadingHotel) {
    return (
      <div className="manager-shell">
        <main className="manager-main">
          <nav className="manager-breadcrumb" aria-label="Breadcrumb">
            <Link to="/hotel-manager">Quản lý khách sạn</Link>
            <span>/</span>
            <span>Đang tải...</span>
          </nav>
          <Outlet />
        </main>
      </div>
    );
  }

  if (hotelId && !hotel) {
    return (
      <div className="manager-shell">
        <main className="manager-main">
          <nav className="manager-breadcrumb" aria-label="Breadcrumb">
            <Link to="/hotel-manager">Quản lý khách sạn</Link>
            <span>/</span>
            <span>Không tìm thấy</span>
          </nav>
          <Outlet />
        </main>
      </div>
    );
  }

  const currentPage = (() => {
    if (!hotel) return null;
    if (location.pathname.endsWith("/rooms")) return "Quản lý phòng";
    if (location.pathname.endsWith("/bookings")) return "Quản lý booking";
    if (location.pathname.endsWith("/services")) return "Quản lý dịch vụ";
    if (location.pathname.endsWith("/info")) return "Thông tin khách sạn";
    return "Tổng quan";
  })();

  return (
    <div className="manager-shell has-sidebar">
      <ManagerSidebar />
      <main className="manager-main">
        <nav className="manager-breadcrumb" aria-label="Breadcrumb">
          <Link to="/hotel-manager">Quản lý khách sạn</Link>
          {hotel && (
            <>
              <span>/</span>
              <Link to={`/hotel-manager/${hotel._id || hotel.id}`}>{hotel.name}</Link>
            </>
          )}
          {currentPage && (
            <>
              <span>/</span>
              <span>{currentPage}</span>
            </>
          )}
        </nav>
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
