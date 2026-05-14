import React from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import hotelService from "../services/hotelService";

export default function ManagerBookings() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = React.useState(null);
  const [bookings, setBookings] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    if (!hotelId) return;

    hotelService.getHotelById(hotelId)
      .then((h) => mounted && setHotel(h))
      .catch(() => mounted && setHotel(null));

    import("../services/bookingService").then((m) => {
      m.default.getHotelBookings({}).then((result) => {
        if (!mounted) return;
        // result might be { bookings, pagination }
        if (result.bookings) setBookings(result.bookings);
        else if (Array.isArray(result)) setBookings(result);
      }).catch(() => {});
    });

    return () => (mounted = false);
  }, [hotelId]);

  if (!hotel) {
    return (
      <div className="manager-dashboard">
        <section className="manager-page-header">
          <div>
            <p className="eyebrow">Không tìm thấy</p>
            <h1>Khách sạn không tồn tại</h1>
            <p>Vui lòng quay lại danh sách khách sạn để chọn khách sạn cần quản lý booking.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      <section className="manager-page-header">
        <div>
          <p className="eyebrow">Quản lý booking</p>
          <h1>Booking của {hotel.name}</h1>
          <p>Xem tất cả booking, xác nhận đặt phòng, check-in, check-out và xử lý yêu cầu hủy.</p>
        </div>
        <Button variant="outline" className="manager-card-link">
          Xuất danh sách
        </Button>
      </section>

      <section className="management-card">
        <div className="manager-table">
          <div className="table-row table-head booking-row">
            <span>Mã booking</span>
            <span>Khách hàng</span>
            <span>Phòng</span>
            <span>Ngày ở</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          {bookings.map((booking) => (
            <div className="table-row booking-row" key={booking._id || booking.id}>
              <span>{booking._id || booking.id}</span>
              <strong>{booking.guest || booking.user?.name || booking.guestInfo?.firstName}</strong>
              <span>{booking.room || (booking.rooms && booking.rooms.map(r=> r.roomTypeName).join(", "))}</span>
              <span>{booking.date || new Date(booking.checkInDate).toLocaleDateString()}</span>
              <span className="status-pill">{booking.status}</span>
              <span className="row-actions booking-actions">
                <Button variant="outline" type="button">Chi tiết</Button>
                <Button type="button">Xác nhận</Button>
                <Button variant="outline" type="button">Check-in</Button>
                <Button variant="outline" type="button">Check-out</Button>
                <Button variant="danger" type="button">Hủy</Button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-panel-grid">
        <Card className="management-card">
          <p className="eyebrow">Chi tiết booking</p>
          <h2>BK-2048</h2>
          <div className="profile-list compact-list">
            <div>
              <span>Khách hàng</span>
              <strong>Nguyễn Minh Anh</strong>
            </div>
            <div>
              <span>Số điện thoại</span>
              <strong>0901 222 333</strong>
            </div>
            <div>
              <span>Yêu cầu</span>
              <strong>Phòng tầng cao, check-in sớm</strong>
            </div>
            <div>
              <span>Thanh toán</span>
              <strong>Chưa thanh toán</strong>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
