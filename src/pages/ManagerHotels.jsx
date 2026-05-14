import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import hotelService from "../services/hotelService";

export default function ManagerHotels() {
  const [hotels, setHotels] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    hotelService.getMyHotels().then((h) => {
      if (!mounted) return;
      // getMyHotels might return single hotel or array - normalize
      if (!h) setHotels([]);
      else if (Array.isArray(h)) setHotels(h);
      else setHotels([h]);
    }).catch(() => {
      if (mounted) setHotels([]);
    }).finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const totalBookings = hotels.reduce((total, hotel) => total + (hotel.bookings || 0), 0);
  const totalRevenue = hotels.reduce((total, hotel) => total + (Number.parseInt(hotel.revenue, 10) || 0), 0);

  return (
    <div className="manager-dashboard">
      <section className="manager-page-header">
        <div>
          <p className="eyebrow">Tài khoản quản lý</p>
          <h1>Khách sạn của tôi</h1>
          <p>Chọn một khách sạn để vào quản lý phòng, booking, dịch vụ và thông tin hiển thị.</p>
        </div>
        <Button className="manager-card-link">Đăng ký khách sạn mới</Button>
      </section>

      <section className="manager-stats owner-stats">
        <Card className="stat-card">
          <span>Tổng khách sạn</span>
          <strong>{hotels.length}</strong>
          <small>Khách sạn đã đăng ký</small>
        </Card>
        <Card className="stat-card">
          <span>Tổng booking</span>
          <strong>{totalBookings}</strong>
          <small>Từ tất cả khách sạn</small>
        </Card>
        <Card className="stat-card">
          <span>Tổng doanh thu</span>
          <strong>{totalRevenue}M</strong>
          <small>Doanh thu dự kiến tháng này</small>
        </Card>
      </section>

      <section className="hotel-list-grid">
        {hotels.map((hotel) => (
          <Card className="manager-hotel-card" key={hotel._id || hotel.id}>
            <div>
              <span className="status-pill approved">{hotel.status}</span>
              <h2>{hotel.name}</h2>
              <p>
                {hotel.address.street}, {hotel.address.ward}, {hotel.address.city}
              </p>
            </div>

              <div className="hotel-card-stats">
              <div>
                <span>Phòng</span>
                <strong>{hotel.rooms}</strong>
              </div>
              <div>
                <span>Booking</span>
                <strong>{hotel.bookings}</strong>
              </div>
              <div>
                <span>Doanh thu</span>
                <strong>{hotel.revenue}</strong>
              </div>
            </div>

              <Link className="manager-card-link" to={`/hotel-manager/${hotel._id}`}>
                Vào quản lý
              </Link>
          </Card>
        ))}
      </section>
    </div>
  );
}
