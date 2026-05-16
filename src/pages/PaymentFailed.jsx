import { useNavigate } from "react-router-dom";
import "../styles/Booking.css";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="booking-page">
      <h1 className="booking-heading">Thanh toán không thành công</h1>
      <p>Thanh toán đã bị hủy hoặc gặp lỗi. Vui lòng thử lại sau.</p>
      <button className="button-primary" onClick={() => navigate("/booking")}>Quay lại đặt phòng</button>
      <button className="button-secondary" onClick={() => navigate("/my-bookings")}>Xem đơn của tôi</button>
    </div>
  );
};

export default PaymentFailed;
