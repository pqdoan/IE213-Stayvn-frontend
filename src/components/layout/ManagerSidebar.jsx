import React from "react";
import { NavLink, useParams } from "react-router-dom";
import hotelService from "../../services/hotelService";

const ManagerSidebar = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    if (!hotelId) return;
    hotelService.getHotelById(hotelId).then((h) => {
      if (mounted) setHotel(h);
    }).catch(() => {
      if (mounted) setHotel(null);
    });

    return () => (mounted = false);
  }, [hotelId]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Quản lý khách sạn</h3>
        <p>{hotelId ? (hotel ? hotel.name : "Đang tải...") : "Chọn khách sạn để bắt đầu"}</p>
      </div>

      <div className="sidebar-menu">
        {hotelId && (
          <>
            <NavLink className="sidebar-item" to={`/hotel-manager/${hotelId}`} end>
              Tổng quan
            </NavLink>
            <NavLink className="sidebar-item" to={`/hotel-manager/${hotelId}/info`}>
              Thông tin khách sạn
            </NavLink>
            <NavLink className="sidebar-item" to={`/hotel-manager/${hotelId}/rooms`}>
              Quản lý phòng
            </NavLink>
            <NavLink className="sidebar-item" to={`/hotel-manager/${hotelId}/bookings`}>
              Quản lý booking
            </NavLink>
            <NavLink className="sidebar-item" to={`/hotel-manager/${hotelId}/services`}>
              Quản lý dịch vụ
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerSidebar;
