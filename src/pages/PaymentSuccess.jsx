import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Booking.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="booking-page">
      <h1 className="booking-heading">Thanh toán thành công</h1>
      <p>Đơn đặt phòng của bạn đã được thanh toán thành công.</p>
      {bookingId && <p>Mã booking: {bookingId}</p>}
      <button className="button-primary" onClick={() => navigate("/my-bookings")}>Xem đơn của tôi</button>
      <button className="button-secondary" onClick={() => navigate("/")}>Về trang chủ</button>
    </div>
  );
};

export default PaymentSuccess;
