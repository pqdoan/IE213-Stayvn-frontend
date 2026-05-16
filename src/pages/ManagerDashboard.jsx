import { useEffect, useState } from "react";
import Card from "../components/common/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/common/Button";
import bookingService from "../services/bookingService";

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getHotelBookings({});
      const data = res.data?.data?.bookings || res.data?.data || [];
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Không thể tải bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirm = async (id) => {
    if (!confirm("Xác nhận booking này?")) return;
    try {
      await bookingService.confirmBookingManager(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "confirmed" } : b)),
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể xác nhận booking");
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
  };

  return (
    <div>
      <h2>Dashboard quản lý</h2>

      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <Card>Booking: {stats.total}</Card>
        <Card>Confirmed: {stats.confirmed}</Card>
        <Card>Pending: {stats.pending}</Card>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div>
        {bookings.map((b) => (
          <Card key={b._id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>
                  {b.user?.firstName || b.guestInfo?.firstName || "Khách"}
                </strong>
                <div>{b.user?.phone || b.guestInfo?.phone}</div>
                <div>
                  {b.checkInDate
                    ? new Date(b.checkInDate).toLocaleDateString()
                    : "-"}{" "}
                  →{" "}
                  {b.checkOutDate
                    ? new Date(b.checkOutDate).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ marginBottom: 8 }}>
                  {(b.totalPrice || b.total || 0).toLocaleString()}₫
                </div>
                <Badge
                  type={
                    b.status === "pending"
                      ? "warning"
                      : b.status === "confirmed"
                        ? "info"
                        : "default"
                  }
                >
                  {b.status}
                </Badge>
                {b.status === "pending" && (
                  <div style={{ marginTop: 8 }}>
                    <Button onClick={() => handleConfirm(b._id)}>
                      Xác nhận
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
