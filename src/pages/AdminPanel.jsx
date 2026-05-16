import { useState, useEffect } from "react";
import "../styles/AdminPanel.css";
import adminService from "../services/adminService";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("hotels");
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalHotel, setModalHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "hotels") fetchHotels();
    else if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await adminService.getHotelsForReview();
      const payload = res.data?.data;
      setHotels(Array.isArray(payload) ? payload : payload?.hotels || []);
    } catch (err) {
      setError("Không thể tải danh sách khách sạn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      setError("Không thể tải danh sách người dùng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveHotel = async (hotelId) => {
    try {
      await adminService.approveHotel(hotelId);
      setHotels((prev) =>
        prev.map((h) => (h._id === hotelId ? { ...h, status: "approved" } : h)),
      );
    } catch (err) {
      setError("Không thể duyệt khách sạn");
      console.error(err);
    }
  };

  const handleRejectHotel = async (hotelId) => {
    try {
      await adminService.rejectHotel(hotelId);
      setHotels((prev) =>
        prev.map((h) => (h._id === hotelId ? { ...h, status: "rejected" } : h)),
      );
    } catch (err) {
      setError("Không thể từ chối khách sạn");
      console.error(err);
    }
  };

  const handleBlockHotel = async (hotelId) => {
    try {
      await adminService.blockHotel(hotelId);
      setHotels((prev) =>
        prev.map((h) => (h._id === hotelId ? { ...h, status: "blocked" } : h)),
      );
    } catch (err) {
      setError("Không thể block khách sạn");
      console.error(err);
    }
  };

  const handleUnblockHotel = async (hotelId) => {
    try {
      await adminService.unblockHotel(hotelId);
      setHotels((prev) =>
        prev.map((h) => (h._id === hotelId ? { ...h, status: "approved" } : h)),
      );
    } catch (err) {
      setError("Không thể bỏ block khách sạn");
      console.error(err);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn block người dùng này không?")) {
      return;
    }

    try {
      await adminService.blockUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: "blocked" } : u)),
      );
    } catch (err) {
      setError("Không thể block người dùng");
      console.error(err);
    }
  };

  const handleUnblockUser = async (userId) => {
    if (
      !window.confirm("Bạn có chắc chắn muốn bỏ block người dùng này không?")
    ) {
      return;
    }

    try {
      await adminService.unblockUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: "active" } : u)),
      );
    } catch (err) {
      setError("Không thể bỏ block người dùng");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#FFA500",
      approved: "#4CAF50",
      rejected: "#F44336",
      blocked: "#9C27B0",
      active: "#4CAF50",
    };
    return colors[status] || "#333";
  };

  return (
    <div className="admin-panel">
      <h1>🛡️ Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "hotels" ? "active" : ""}`}
          onClick={() => setActiveTab("hotels")}
        >
          🏨 Quản lý Khách sạn
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Quản lý Người dùng
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Đang tải...</div>}

      {/* HOTELS TAB */}
      {activeTab === "hotels" && (
        <div className="tab-content">
          <h2>Duyệt Khách sạn</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên KS</th>
                <th>Chủ sở hữu</th>
                <th>Email</th>
                <th>Thành phố</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.owner?.firstName || "-"}</td>
                  <td>{hotel.owner?.email || "-"}</td>
                  <td>{hotel.address?.city || "-"}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(hotel.status) }}
                    >
                      {hotel.status || "unknown"}
                    </span>
                  </td>
                  <td>
                    {hotel.createdAt
                      ? new Date(hotel.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td className="actions">
                    <button
                      className="btn-view"
                      onClick={() => {
                        setModalHotel(hotel);
                        setIsModalOpen(true);
                      }}
                    >
                      🔍 Xem
                    </button>
                    {hotel.status === "pending" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApproveHotel(hotel._id)}
                        >
                          ✓ Duyệt
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleRejectHotel(hotel._id)}
                        >
                          ✕ Từ chối
                        </button>
                      </>
                    )}
                    {hotel.status === "approved" && (
                      <button
                        className="btn-block"
                        onClick={() => handleBlockHotel(hotel._id)}
                      >
                        🚫 Block
                      </button>
                    )}
                    {hotel.status === "blocked" && (
                      <button
                        className="btn-unblock"
                        onClick={() => handleUnblockHotel(hotel._id)}
                      >
                        ✓ Bỏ Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="tab-content">
          <h2>Quản lý Người dùng</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">
                      {user.role === "customer"
                        ? "Khách hàng"
                        : user.role === "hotel_owner"
                          ? "Chủ khách sạn"
                          : "Admin"}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="actions">
                    {user.status === "active" ? (
                      <button
                        className="btn-block"
                        onClick={() => handleBlockUser(user._id)}
                      >
                        🚫 Block
                      </button>
                    ) : (
                      <button
                        className="btn-unblock"
                        onClick={() => handleUnblockUser(user._id)}
                      >
                        ✓ Bỏ Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && modalHotel && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalHotel.name}</h3>
              <button onClick={() => setIsModalOpen(false)}>Đóng</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Chủ sở hữu:</strong>{" "}
                {modalHotel.owner?.firstName || "-"} (
                {modalHotel.owner?.email || "-"})
              </p>
              <p>
                <strong>Địa chỉ:</strong> {modalHotel.address?.street || ""}{" "}
                {modalHotel.address?.city || ""}
              </p>
              <p>
                <strong>Tiện nghi:</strong>{" "}
                {(modalHotel.amenities || []).join(", ")}
              </p>
              <p>
                <strong>Mô tả:</strong>
              </p>
              <p>{modalHotel.description || "-"}</p>
              {modalHotel.image && modalHotel.image.length > 0 && (
                <div className="modal-images">
                  {modalHotel.image.map((img, idx) => (
                    <img key={idx} src={img.url || img} alt={`img-${idx}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
