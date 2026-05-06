import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const bookingsMock = [
  {
    id: "#BK-20240501",
    date: "30/04/2026",
    status: "pending",
    hotel: "Biển Xanh Grand Resort",
    location: "Nha Trang",
    checkin: "01/06/2027",
    checkout: "05/06/2027",
    nights: 4,
    room: "Deluxe View Biển × 1",
    guests: 2,
    services: "Bữa sáng × 2ng × 4ng · Đưa đón sân bay × 1",
    total: 4080000,
  },
  {
    id: "#BK-20240498",
    date: "15/04/2026",
    status: "confirmed",
    hotel: "Sơn Trà Ocean View Hotel",
    location: "Đà Nẵng",
    checkin: "10/05/2027",
    checkout: "13/05/2027",
    nights: 3,
    room: "Superior × 1",
    guests: 2,
    total: 1950000,
  },
  {
    id: "#BK-20240490",
    date: "01/04/2026",
    status: "staying",
    hotel: "Phố Cổ Heritage Hanoi",
    location: "Hà Nội",
    checkin: "28/04/2026",
    checkout: "02/05/2026",
    nights: 4,
    room: "Deluxe Heritage × 1",
    guests: 2,
    total: 5200000,
  },
];

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "warning" },
  confirmed: { label: "Đã xác nhận", color: "info" },
  staying: { label: "Đang lưu trú", color: "success" },
  completed: { label: "Hoàn thành", color: "default" },
  canceled: { label: "Đã hủy", color: "danger" },
};

const MyBookings = () => {
  const [filter, setFilter] = useState("all");

  const filteredBookings =
    filter === "all"
      ? bookingsMock
      : bookingsMock.filter((b) => b.status === filter);

  return (
    <div className="container">
      {/* HEADER */}
      <div className="page-header">
        <h2>Booking của tôi</h2>
        <Button>+ Đặt phòng mới</Button>
      </div>

      {/* FILTER TABS */}
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

      {/* LIST */}
      <div className="booking-list">
        {filteredBookings.map((b) => (
          <Card key={b.id} className="booking-card">
            {/* HEADER */}
            <div className="booking-header">
              <div>
                Mã booking: <strong>{b.id}</strong> · {b.date}
              </div>
              <Badge type={statusMap[b.status].color}>
                {statusMap[b.status].label}
              </Badge>
            </div>

            {/* BODY */}
            <div className="booking-body">
              <div className="booking-img">🏨</div>

              <div className="booking-info">
                <h3>{b.hotel}</h3>
                <p>📍 {b.location}</p>
                <p>
                  📅 {b.checkin} → {b.checkout} · {b.nights} đêm
                </p>
                <p>
                  🛏️ {b.room} · {b.guests} khách
                </p>
                {b.services && <p>🍽 {b.services}</p>}
              </div>
            </div>

            {/* FOOTER */}
            <div className="booking-footer">
              <div className="price">{b.total.toLocaleString()}₫</div>

              <div className="actions">
                <Button variant="outline">Xem chi tiết</Button>

                {b.status === "pending" || b.status === "confirmed" ? (
                  <Button variant="danger">Hủy</Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
