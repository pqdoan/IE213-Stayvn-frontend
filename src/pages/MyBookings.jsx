import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Hotel, MapPin, RefreshCw, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import bookingService from "../services/bookingService";
import "./MyBookings.css";

const statusMap = {
  pending: { label: "Chờ xác nhận", className: "status-warning" },
  confirmed: { label: "Đã xác nhận", className: "status-info" },
  checked_in: { label: "Đã check-in", className: "status-success" },
  checked_out: { label: "Đã check-out", className: "status-default" },
  completed: { label: "Hoàn thành", className: "status-default" },
  canceled: { label: "Đã hủy", className: "status-danger" },
};

const paymentMap = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán lỗi",
};

const tabs = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "checked_in", label: "Đã check-in" },
  { key: "completed", label: "Hoàn thành" },
  { key: "canceled", label: "Đã hủy" },
];

const PAGE_SIZE = 5;

const fallbackImage =
  import.meta.env.VITE_FALLBACK_IMAGE ||
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);

const formatDate = (date) => {
  if (!date) return "--";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const getNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;

  const diff = new Date(checkOutDate) - new Date(checkInDate);
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

const getHotelImage = (booking) =>
  booking.hotel?.image?.[0]?.url ||
  booking.hotel?.image?.[0] ||
  fallbackImage;

const getRoomText = (booking) => {
  if (!booking.rooms?.length) return "Chưa có thông tin phòng";

  return booking.rooms
    .map((item) => {
      const name = item.roomTypeName || item.room?.name || "Phòng";
      return `${name} x ${item.quantity || 1}`;
    })
    .join(", ");
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [cancelingId, setCancelingId] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [error, setError] = useState("");

  const isLoggedIn = useMemo(() => Boolean(localStorage.getItem("token")), []);

  const fetchBookings = async (status = filter, targetPage = page) => {
    if (!localStorage.getItem("token")) return;

    try {
      setLoading(true);
      setError("");

      const params =
        status === "all"
          ? { page: targetPage, limit: PAGE_SIZE }
          : { status, page: targetPage, limit: PAGE_SIZE };
      const res = await bookingService.getMyBookings(params);

      setBookings(res.data?.data?.bookings || []);
      setPagination(
        res.data?.data?.pagination || {
          total: 0,
          page: targetPage,
          limit: PAGE_SIZE,
          totalPages: 1,
        },
      );
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      setError(err.response?.data?.message || "Không thể tải booking của bạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(filter, page);
  }, [filter, page]);

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const handleCancel = async () => {
    if (!cancelTarget?._id) return;

    try {
      setCancelingId(cancelTarget._id);
      setError("");

      await bookingService.cancel(cancelTarget._id);
      setCancelTarget(null);
      await fetchBookings(filter, page);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Không thể hủy booking này.");
    } finally {
      setCancelingId("");
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="my-bookings-page">
        <section className="my-bookings-empty">
          <Hotel size={44} />
          <h1>Booking của tôi</h1>
          <p>Bạn cần đăng nhập để xem danh sách booking đã đặt.</p>
          <Link className="my-bookings-primary" to="/login">
            Đăng nhập
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="my-bookings-page">
      <div className="my-bookings-header">
        <div>
          <span>StayVN</span>
          <h1>Booking của tôi</h1>
          <p>Theo dõi trạng thái đặt phòng, thanh toán và lịch lưu trú.</p>
        </div>

        <button
          className="my-bookings-refresh"
          disabled={loading}
          onClick={() => fetchBookings(filter, page)}
        >
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      <div className="my-bookings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={filter === tab.key ? "active" : ""}
            onClick={() => handleFilterChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="my-bookings-alert">{error}</div>}

      {cancelTarget && (
        <div className="my-bookings-modal-backdrop" role="dialog" aria-modal="true">
          <div className="my-bookings-modal">
            <div>
              <span className="my-bookings-modal-kicker">Xác nhận hủy</span>
              <h2>Hủy booking này?</h2>
              <p>
                Booking tại{" "}
                <strong>{cancelTarget.hotel?.name || "khách sạn này"}</strong>{" "}
                sẽ được chuyển sang trạng thái đã hủy.
              </p>
            </div>

            <div className="my-bookings-modal-summary">
              <span>Mã booking</span>
              <strong>{cancelTarget._id}</strong>
            </div>

            <div className="my-bookings-modal-actions">
              <button
                className="my-bookings-secondary"
                disabled={cancelingId === cancelTarget._id}
                onClick={() => setCancelTarget(null)}
              >
                Không hủy
              </button>
              <button
                className="my-bookings-danger"
                disabled={cancelingId === cancelTarget._id}
                onClick={handleCancel}
              >
                {cancelingId === cancelTarget._id ? "Đang hủy..." : "Hủy booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="my-bookings-loading">Đang tải booking...</div>
      ) : bookings.length === 0 ? (
        <section className="my-bookings-empty">
          <CalendarDays size={44} />
          <h2>Chưa có booking</h2>
          <p>
            {filter === "all"
              ? "Bạn chưa có booking nào."
              : "Không có booking nào ở trạng thái này."}
          </p>
          <button
            className="my-bookings-primary"
            onClick={() => navigate("/hotels")}
          >
            Tìm khách sạn
          </button>
        </section>
      ) : (
        <>
          <section className="my-bookings-list">
          {bookings.map((booking) => {
            const status = statusMap[booking.status] || {
              label: booking.status,
              className: "status-default",
            };
            const canCancel = ["pending", "confirmed"].includes(booking.status);

            return (
              <article className="my-booking-card" key={booking._id}>
                <img
                  className="my-booking-image"
                  src={getHotelImage(booking)}
                  alt={booking.hotel?.name || "Khách sạn"}
                />

                <div className="my-booking-content">
                  <div className="my-booking-top">
                    <div>
                      <span className="my-booking-code">
                        Mã booking: {booking._id}
                      </span>
                      <h2>{booking.hotel?.name || "Khách sạn"}</h2>
                    </div>

                    <div className="my-booking-badges">
                      <span className={`my-booking-status ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="my-booking-payment">
                        {paymentMap[booking.paymentStatus] ||
                          booking.paymentStatus ||
                          "Chưa rõ thanh toán"}
                      </span>
                    </div>
                  </div>

                  <div className="my-booking-location">
                    <MapPin size={16} />
                    <span>
                      {booking.hotel?.address?.street &&
                        `${booking.hotel.address.street}, `}
                      {booking.hotel?.address?.ward &&
                        `${booking.hotel.address.ward}, `}
                      {booking.hotel?.address?.city || "Việt Nam"}
                    </span>
                  </div>

                  <div className="my-booking-grid">
                    <div>
                      <span>Nhận phòng</span>
                      <strong>{formatDate(booking.checkInDate)}</strong>
                    </div>
                    <div>
                      <span>Trả phòng</span>
                      <strong>{formatDate(booking.checkOutDate)}</strong>
                    </div>
                    <div>
                      <span>Số đêm</span>
                      <strong>
                        {getNights(booking.checkInDate, booking.checkOutDate)}
                      </strong>
                    </div>
                    <div>
                      <span>Khách</span>
                      <strong>
                        <Users size={15} />
                        {booking.guests || 1}
                      </strong>
                    </div>
                  </div>

                  <div className="my-booking-room">{getRoomText(booking)}</div>

                  <div className="my-booking-footer">
                    <div>
                      <span>Tổng tiền</span>
                      <strong>{formatCurrency(booking.totalPrice)}</strong>
                    </div>

                    <div className="my-booking-actions">
                      <button
                        className="my-bookings-secondary"
                        onClick={() => navigate(`/booking/${booking._id}`)}
                      >
                        Xem chi tiết
                      </button>

                      {canCancel && (
                        <button
                          className="my-bookings-danger"
                          disabled={cancelingId === booking._id}
                          onClick={() => setCancelTarget(booking)}
                        >
                          {cancelingId === booking._id ? "Đang hủy..." : "Hủy"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          </section>

          {pagination.totalPages > 1 && (
            <div className="my-bookings-pagination">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Trước
              </button>

              {Array.from({ length: pagination.totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    className={pageNumber === page ? "active" : ""}
                    disabled={loading}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                disabled={page >= pagination.totalPages || loading}
                onClick={() =>
                  setPage((current) =>
                    Math.min(pagination.totalPages, current + 1),
                  )
                }
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
