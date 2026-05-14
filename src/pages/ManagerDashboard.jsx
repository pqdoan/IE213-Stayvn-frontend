import React from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import hotelService from "../services/hotelService";
import reviewService from "../services/reviewService";

export default function ManagerDashboard() {
  const { hotelId } = useParams();

  const [hotel, setHotel] = React.useState(null);
  const [loading, setLoading] = React.useState(Boolean(hotelId));

  const [reviews, setReviews] = React.useState([]);
  const [reviewsLoading, setReviewsLoading] = React.useState(false);

  const formatDate = (iso) => {
    if (!iso) return "";

    try {
      return new Date(iso).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return iso;
    }
  };

  const renderStars = (rating) => {
    const r = Math.round(Number(rating) || 0);

    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={"gm-star" + (i <= r ? " filled" : "")}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  // fetch hotel
  React.useEffect(() => {
    let mounted = true;

    if (!hotelId) return;

    setLoading(true);

    hotelService
      .getHotelById(hotelId)
      .then((h) => {
        if (mounted) setHotel(h);
      })
      .catch(() => {
        if (mounted) setHotel(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [hotelId]);

  // fetch reviews today + polling
  React.useEffect(() => {
    if (!hotelId) return;

    let mounted = true;

    const fetchAndUpdate = async () => {
      if (!mounted) return;

      setReviewsLoading(true);

      try {
        const today = new Date();
        const isoDate = today.toISOString().slice(0, 10);

        const data = await reviewService.getHotelReviewsByDate(
          hotelId,
          isoDate,
          1,
          100
        );

        if (!mounted) return;

        setReviews(data?.reviews || []);

        // update local hotel rating
        if (data?.avgRating !== undefined) {
          setHotel((prev) => ({
            ...(prev || {}),
            avgRating: data.avgRating,
            totalReviews: data.totalReviews
          }));
        }
      } catch (e) {
        if (mounted) {
          setReviews([]);
        }
      } finally {
        if (mounted) {
          setReviewsLoading(false);
        }
      }
    };

    fetchAndUpdate();

    const intervalId = setInterval(fetchAndUpdate, 10000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [hotelId]);

  if (loading) {
    return (
      <div className="manager-dashboard">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="manager-dashboard">
        <section className="manager-page-header">
          <div>
            <p className="eyebrow">Không tìm thấy</p>
            <h1>Khách sạn không tồn tại</h1>
            <p>
              Vui lòng quay lại danh sách khách sạn để chọn khách sạn cần quản
              lý.
            </p>
          </div>

          <Link className="manager-card-link" to="/hotel-manager">
            Xem danh sách
          </Link>
        </section>
      </div>
    );
  }

  // placeholder stats
  const availableRooms = 0;
  const pendingBookings = 0;
  const services = [];

  return (
    <div className="manager-dashboard">
      <section className="manager-hero">
        <div>
          <p className="eyebrow">Tổng quan khách sạn</p>
          <h1>{hotel.name}</h1>
          <p>{hotel.description}</p>
        </div>
        <div className="manager-actions">
          <Button>Cập nhật hôm nay</Button>
          <Button variant="outline">Xem báo cáo</Button>
        </div>
      </section>

      <section className="manager-stats">
        <Card className="stat-card">
          <span>Doanh thu tháng</span>
          <strong>{hotel.revenue}</strong>
          <small>Từ {hotel.bookings} booking</small>
        </Card>

        <Card className="stat-card">
          <span>Tổng số phòng</span>
          <strong>{hotel.rooms}</strong>
          <small>{availableRooms} phòng còn trống</small>
        </Card>

        <Card className="stat-card">
          <span>Booking chờ xử lý</span>
          <strong>{pendingBookings}</strong>
          <small>Cần xác nhận trong hôm nay</small>
        </Card>

        <Card className="stat-card">
          <span>Dịch vụ đang bán</span>
          <strong>{services.length}</strong>
          <small>Spa, đưa đón, buffet</small>
        </Card>
      </section>

      <section className="manager-grid">
        <Card className="management-card">
          <div className="section-title">
            <div>
              <p className="eyebrow">Đánh giá</p>
              <h2>Đánh giá hôm nay</h2>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{fontSize: 20, fontWeight: 700}}>
                {hotel.avgRating !== null ? `${hotel.avgRating} / 5` : "—"}
              </div>
              <small>{reviews.length} đánh giá hôm nay</small>
            </div>
          </div>

          <div className="gm-review-list">
            {reviewsLoading ? (
              <p>Đang tải đánh giá...</p>
            ) : reviews.length === 0 ? (
              <p>Chưa có đánh giá</p>
            ) : (
              reviews.map((r) => (
                <article
                  key={r._id || r.id}
                  className="gm-review-item"
                >
                  {r.user?.avatar ? (
                    <img
                      className="gm-review-avatar"
                      src={r.user.avatar}
                      alt={r.user?.name}
                    />
                  ) : (
                    <div
                      className="gm-review-avatar"
                      style={{ background: "#eee" }}
                    />
                  )}

                  <div className="gm-review-body">
                    <div className="gm-review-header">
                      <div className="gm-review-meta">
                        <span className="gm-review-name">
                          {r.user?.lastname || "Người dùng"}
                        </span>

                        <span className="gm-review-date">
                          {formatDate(r.createdAt)}
                        </span>
                      </div>

                      <div className="gm-review-stars">
                        {renderStars(r.rating)}
                      </div>
                    </div>

                    <div className="gm-review-text">
                      {r.comment}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="link-wrapper">
            <Link className="link-to-reviews" to={`/hotel-manager/${hotelId}/info#reviews`}>
              Xem tất cả các đánh giá
            </Link>
          </div>
        </Card>

        <Card className="quick-panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Việc cần làm</p>

              <h2>Hôm nay</h2>
            </div>
          </div>

          <div className="todo-list">
            <label>
              <input type="checkbox" />
              Xác nhận {pendingBookings} booking mới
            </label>

            <label>
              <input type="checkbox" />
              Kiểm tra phòng đang bảo trì
            </label>

            <label>
              <input type="checkbox" />
              Cập nhật dịch vụ đang tạm ẩn
            </label>
          </div>
        </Card>
      </section>
    </div>
  );
}