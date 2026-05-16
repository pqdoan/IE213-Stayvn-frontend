import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import paymentService from "../services/paymentService";
import "../styles/Booking.css";

const PaymentMock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentId, setPaymentId] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPaymentId(params.get("paymentId"));
    setBookingId(params.get("bookingId"));
  }, [location.search]);

  const handleMockComplete = async () => {
    if (!paymentId) {
      setMessage("Không tìm thấy thông tin thanh toán.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await paymentService.completeMockPayment(paymentId);
      const booking = response.data?.booking;

      if (!booking) {
        throw new Error("Không thể hoàn tất thanh toán.");
      }

      navigate(`/payment/success?bookingId=${booking._id}`);
    } catch (error) {
      console.error("Lỗi khi hoàn tất thanh toán giả lập:", error);
      setMessage(
        error?.response?.data?.message ||
          "Thanh toán giả lập không thành công. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <h1 className="booking-heading">Thanh toán giả lập</h1>
      <p>Đây là bài toán thanh toán giả lập để thử nghiệm mà không dùng tiền thật.</p>
      <div className="booking-summary">
        <div className="summary-row">
          <span>Mã thanh toán</span>
          <span>{paymentId || "-"}</span>
        </div>
        <div className="summary-row">
          <span>Mã đặt phòng</span>
          <span>{bookingId || "-"}</span>
        </div>
      </div>
      {message && <div className="booking-message">{message}</div>}
      <button
        className="button-primary"
        disabled={loading}
        onClick={handleMockComplete}
      >
        {loading ? "Đang hoàn tất..." : "Hoàn tất thanh toán giả lập"}
      </button>
      <button className="button-secondary" onClick={() => navigate("/my-bookings")}>Xem đơn của tôi</button>
    </div>
  );
};

export default PaymentMock;
