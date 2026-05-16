import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import bookingService from "../services/bookingService";

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "warning" },
  confirmed: { label: "Đã xác nhận", color: "info" },
  staying: { label: "Đang lưu trú", color: "success" },
  completed: { label: "Hoàn thành", color: "default" },
  canceled: { label: "Đã hủy", color: "danger" },
};

const MyBookings = () => {
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async (status = null) => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (status && status !== "all") params.status = status;
      const res = await bookingService.getMyBookings(params);
      setBookings(res.data?.data?.bookings || res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Không thể tải booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    fetchBookings(filter === "all" ? null : filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleCancel = async (bookingId) => {
    if (!confirm("Bạn có chắc muốn hủy booking này?")) return;
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "canceled" } : b,
        ),
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể hủy booking");
    }
  };

  const renderBookings = () => {
    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (bookings.length === 0) return <p>Chưa có booking nào.</p>;

    return bookings.map((b) => {
      const idLabel = `#${b._id.slice(-8).toUpperCase()}`;
      const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("vi-VN") : "-";
      const date = formatDate(b.createdAt || b.updatedAt || Date.now());
      const statusObj = statusMap[b.status] || {
        label: b.status,
        color: "default",
      };
      const hotelName = b.hotel?.name || "-";
      const location = b.hotel?.address?.city || "-";
      const checkin = b.checkInDate ? formatDate(b.checkInDate) : "-";
      const checkout = b.checkOutDate ? formatDate(b.checkOutDate) : "-";
      const nights = Math.max(
        0,
        Math.ceil(
          (new Date(b.checkOutDate) - new Date(b.checkInDate)) /
            (1000 * 60 * 60 * 24),
        ),
      );
      const roomSummary = (b.rooms || [])
        .map(
          (r) => `${r.roomTypeName || r.room?.name || "Phòng"} × ${r.quantity}`,
        )
        .join(" · ");
      const servicesSummary = (b.services || [])
        .map((s) => `${s.name || s.service?.name} × ${s.quantity || 1}`)
        .join(" · ");
      const total = b.totalPrice || b.total || 0;

      return (
        <Card key={b._id} className="booking-card">
          <div className="booking-header">
            <div>
              Mã booking: <strong>{idLabel}</strong> · {date}
            </div>
            <Badge type={statusObj.color}>{statusObj.label}</Badge>
          </div>

          <div className="booking-body">
            <div className="booking-img">🏨</div>

            <div className="booking-info">
              <h3>{hotelName}</h3>
              <p>📍 {location}</p>
              <p>
                📅 {checkin} → {checkout} · {nights} đêm
              </p>
              <p>
                🛏️ {roomSummary} · {b.guests} khách
              </p>
              {servicesSummary && <p>🍽 {servicesSummary}</p>}
            </div>
          </div>

          <div className="booking-footer">
            <div className="price">{total.toLocaleString()}₫</div>

            <div className="actions">
              <Button variant="outline">Xem chi tiết</Button>
              {(b.status === "pending" || b.status === "confirmed") && (
                <Button variant="danger" onClick={() => handleCancel(b._id)}>
                  Hủy
                </Button>
              )}
            </div>
          </div>
        </Card>
      );
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Booking của tôi</h2>
        <Button onClick={() => window.location.assign("/hotels")}>
          + Đặt phòng mới
        </Button>
      </div>

      <div className="tabs">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Chờ xác nhận" },
          { key: "confirmed", label: "Đã xác nhận" },
          { key: "staying", label: "Đang lưu trú" },
        ].map((tab) => (
          <div
            key={tab.key}
            className={`tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="booking-list">{renderBookings()}</div>
    </div>
  );
};

export default MyBookings;
