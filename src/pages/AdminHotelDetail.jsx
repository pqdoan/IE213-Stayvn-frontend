import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Ban, CheckCircle2, Hotel, Unlock, XCircle } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import adminService from "../services/adminService";
import "./AdminHotelDetail.css";

const statusMap = {
  pending: { label: "Chờ duyệt", className: "status-warning" },
  approved: { label: "Đã duyệt", className: "status-success" },
  rejected: { label: "Từ chối", className: "status-danger" },
  blocked: { label: "Đã block", className: "status-default" },
};

const fallbackImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200";

const getLocalUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getRoles = (storedUser) => {
  const role = storedUser?.user?.role || storedUser?.role || [];
  return Array.isArray(role) ? role : [role];
};

const normalizeDetail = (payload, fallbackHotel) => {
  if (!payload) return { hotel: fallbackHotel || null, rooms: [] };
  if (payload.hotel) return { hotel: payload.hotel, rooms: payload.rooms || [] };
  return { hotel: payload, rooms: payload.rooms || [] };
};

export default function AdminHotelDetail() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = useMemo(getLocalUser, []);
  const isAdmin = useMemo(() => getRoles(storedUser).includes("admin"), [storedUser]);

  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminService.getHotelDetail(hotelId);
      const detail = normalizeDetail(res.data?.data, location.state?.hotel);
      setHotel(detail.hotel);
      setRooms(detail.rooms);
    } catch (err) {
      console.error(err);
      if (!location.state?.hotel) {
        setError(
          err.response?.data?.message ||
            "Không thể tải chi tiết khách sạn từ backend.",
        );
      } else {
        setError(
          "Backend chưa trả được chi tiết đầy đủ. Trang đang hiển thị dữ liệu từ danh sách.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token") && isAdmin) {
      fetchDetail();
    }
  }, [hotelId, isAdmin]);

  const runHotelAction = async (action) => {
    if (!hotel?._id) return;

    const actionMap = {
      approve: {
        run: () => adminService.approveHotel(hotel._id),
        message: "Duyệt khách sạn thành công.",
      },
      reject: {
        run: () => adminService.rejectHotel(hotel._id),
        message: "Từ chối khách sạn thành công.",
      },
      block: {
        run: () => adminService.blockHotel(hotel._id),
        message: "Block khách sạn thành công.",
      },
      unblock: {
        run: () => adminService.unblockHotel(hotel._id),
        message: "Unblock khách sạn thành công.",
      },
    };

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await actionMap[action].run();
      setMessage(actionMap[action].message);
      await fetchDetail();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Không thể cập nhật khách sạn.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <main className="admin-hotel-detail-page">
        <section className="admin-detail-empty">
          <Hotel size={44} />
          <h1>Cần đăng nhập</h1>
          <p>Bạn cần đăng nhập admin để xem trang này.</p>
          <Link className="admin-detail-primary" to="/login">
            Đăng nhập
          </Link>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-hotel-detail-page">
        <section className="admin-detail-empty">
          <Hotel size={44} />
          <h1>Không có quyền truy cập</h1>
          <p>Tài khoản hiện tại không có role admin.</p>
        </section>
      </main>
    );
  }

  const status = statusMap[hotel?.status] || {
    label: hotel?.status || "--",
    className: "status-default",
  };

  return (
    <main className="admin-hotel-detail-page">
      <button className="admin-detail-back" onClick={() => navigate("/admin")}>
        <ArrowLeft size={18} />
        Quay lại Admin
      </button>

      {message && <div className="admin-detail-success">{message}</div>}
      {error && <div className="admin-detail-alert">{error}</div>}

      {loading && !hotel ? (
        <div className="admin-detail-loading">Đang tải chi tiết khách sạn...</div>
      ) : !hotel ? (
        <section className="admin-detail-empty">
          <Hotel size={44} />
          <h1>Không có dữ liệu khách sạn</h1>
          <p>Không tìm thấy khách sạn hoặc backend chưa trả được chi tiết.</p>
        </section>
      ) : (
        <>
          <section className="admin-detail-hero">
            <img
              src={hotel.image?.[0]?.url || fallbackImage}
              alt={hotel.name || "Khách sạn"}
            />

            <div>
              <span className={`admin-detail-status ${status.className}`}>
                {status.label}
              </span>
              <h1>{hotel.name}</h1>
              <p>
                {[hotel.address?.street, hotel.address?.ward, hotel.address?.city]
                  .filter(Boolean)
                  .join(", ") || "--"}
              </p>

              <div className="admin-detail-actions">
                {hotel.status === "pending" && (
                  <>
                    <button
                      className="admin-detail-primary"
                      disabled={actionLoading}
                      onClick={() => runHotelAction("approve")}
                    >
                      <CheckCircle2 size={18} />
                      Duyệt
                    </button>
                    <button
                      className="admin-detail-danger"
                      disabled={actionLoading}
                      onClick={() => runHotelAction("reject")}
                    >
                      <XCircle size={18} />
                      Từ chối
                    </button>
                  </>
                )}

                {hotel.status === "approved" && (
                  <button
                    className="admin-detail-danger"
                    disabled={actionLoading}
                    onClick={() => runHotelAction("block")}
                  >
                    <Ban size={18} />
                    Block
                  </button>
                )}

                {hotel.status === "blocked" && (
                  <button
                    className="admin-detail-primary"
                    disabled={actionLoading}
                    onClick={() => runHotelAction("unblock")}
                  >
                    <Unlock size={18} />
                    Unblock
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="admin-detail-grid">
            <div>
              <span>Thành phố</span>
              <strong>{hotel.address?.city || "--"}</strong>
            </div>
            <div>
              <span>Check-in</span>
              <strong>{hotel.checkInTime || "--"}</strong>
            </div>
            <div>
              <span>Check-out</span>
              <strong>{hotel.checkOutTime || "--"}</strong>
            </div>
            <div>
              <span>Giá thấp nhất</span>
              <strong>{hotel.minPrice?.toLocaleString("vi-VN") || "--"}</strong>
            </div>
            <div>
              <span>Giá cao nhất</span>
              <strong>{hotel.maxPrice?.toLocaleString("vi-VN") || "--"}</strong>
            </div>
            <div>
              <span>Đánh giá</span>
              <strong>{hotel.avgRating || "--"}</strong>
            </div>
          </section>

          <section className="admin-detail-section">
            <h2>Mô tả</h2>
            <p>{hotel.description || "--"}</p>
          </section>

          <section className="admin-detail-section">
            <h2>Chủ sở hữu</h2>
            <p>
              {hotel.owner?.email || "--"}
              {hotel.owner?.role?.length ? ` - ${hotel.owner.role.join(", ")}` : ""}
            </p>
          </section>

          <section className="admin-detail-section">
            <h2>Tiện ích</h2>
            <div className="admin-detail-tags">
              {hotel.amenities?.length ? (
                hotel.amenities.map((item) => <span key={item}>{item}</span>)
              ) : (
                <span>Chưa có tiện ích</span>
              )}
            </div>
          </section>

          <section className="admin-detail-section">
            <h2>Phòng</h2>
            {rooms.length ? (
              <div className="admin-detail-rooms">
                {rooms.map((room) => (
                  <div key={room._id}>
                    <strong>{room.name}</strong>
                    <span>
                      {room.price?.toLocaleString("vi-VN") || "--"} VND - sức
                      chứa {room.capacity || "--"} - số lượng{" "}
                      {room.quantity || "--"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Backend hiện chưa trả dữ liệu phòng cho route chi tiết này.</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
