import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Eye,
  Hotel,
  RefreshCw,
  Search,
  Shield,
  Unlock,
  Users,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import adminService from "../services/adminService";
import "./AdminPanel.css";

const PAGE_SIZE = 10;

const hotelStatusMap = {
  pending: { label: "Chờ duyệt", className: "status-warning" },
  approved: { label: "Đã duyệt", className: "status-success" },
  rejected: { label: "Từ chối", className: "status-danger" },
  blocked: { label: "Đã block", className: "status-default" },
};

const hotelStatusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "blocked", label: "Đã block" },
];

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

const Pagination = ({ pagination, page, loading, onPageChange }) => {
  if (!pagination?.totalPages || pagination.totalPages <= 1) return null;

  return (
    <div className="admin-pagination">
      <button disabled={page <= 1 || loading} onClick={() => onPageChange(page - 1)}>
        Trước
      </button>
      {Array.from({ length: pagination.totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            className={pageNumber === page ? "active" : ""}
            disabled={loading}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        disabled={page >= pagination.totalPages || loading}
        onClick={() => onPageChange(page + 1)}
      >
        Sau
      </button>
    </div>
  );
};

export default function AdminHotels() {
  const navigate = useNavigate();
  const storedUser = useMemo(getLocalUser, []);
  const isAdmin = useMemo(() => getRoles(storedUser).includes("admin"), [storedUser]);

  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({ city: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchHotels = async (nextPage = page) => {
    try {
      setLoading(true);
      setError("");

      const res = await adminService.getHotels({
        page: nextPage,
        limit: PAGE_SIZE,
        city: filters.city || undefined,
        status: filters.status || undefined,
      });

      setHotels(res.data?.data?.hotels || []);
      setPagination(
        res.data?.data?.pagination || {
          total: 0,
          page: nextPage,
          limit: PAGE_SIZE,
          totalPages: 1,
        },
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Không thể tải danh sách khách sạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchHotels(page);
  }, [page, isAdmin]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    fetchHotels(1);
  };

  const openHotelAction = (hotelItem, action) => {
    const actions = {
      approve: {
        title: "Duyệt khách sạn?",
        description: `Khách sạn "${hotelItem.name}" sẽ được chuyển sang trạng thái đã duyệt.`,
        run: () => adminService.approveHotel(hotelItem._id),
        successMessage: "Duyệt khách sạn thành công.",
        errorMessage: "Không thể duyệt khách sạn.",
      },
      reject: {
        title: "Từ chối khách sạn?",
        description: `Khách sạn "${hotelItem.name}" sẽ bị từ chối.`,
        run: () => adminService.rejectHotel(hotelItem._id),
        successMessage: "Từ chối khách sạn thành công.",
        errorMessage: "Không thể từ chối khách sạn.",
      },
      block: {
        title: "Block khách sạn?",
        description: `Khách sạn "${hotelItem.name}" sẽ không còn được hiển thị công khai.`,
        run: () => adminService.blockHotel(hotelItem._id),
        successMessage: "Block khách sạn thành công.",
        errorMessage: "Không thể block khách sạn.",
      },
      unblock: {
        title: "Unblock khách sạn?",
        description: `Khách sạn "${hotelItem.name}" sẽ được chuyển lại trạng thái đã duyệt.`,
        run: () => adminService.unblockHotel(hotelItem._id),
        successMessage: "Unblock khách sạn thành công.",
        errorMessage: "Không thể unblock khách sạn.",
      },
    };

    setConfirmAction(actions[action]);
  };

  const runAction = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(true);
      setError("");
      setMessage("");
      await confirmAction.run();
      setMessage(confirmAction.successMessage);
      setConfirmAction(null);
      await fetchHotels(page);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || confirmAction.errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <main className="admin-page">
        <section className="admin-empty">
          <Shield size={44} />
          <h1>Admin Panel</h1>
          <p>Bạn cần đăng nhập bằng tài khoản admin để truy cập trang này.</p>
          <Link className="admin-primary-btn" to="/login">
            Đăng nhập
          </Link>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <section className="admin-empty">
          <Shield size={44} />
          <h1>Không có quyền truy cập</h1>
          <p>Tài khoản hiện tại không có vai trò admin.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <span>StayVN Admin</span>
          <h1>Quản lý khách sạn</h1>
          <p>Duyệt, từ chối, khóa và mở khóa khách sạn trên hệ thống.</p>
        </div>

        <button className="admin-secondary-btn" disabled={loading} onClick={() => fetchHotels(page)}>
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      <div className="admin-tabs">
        <Link className="active" to="/admin/hotels">
          <Hotel size={18} />
          Khách sạn
        </Link>
        <Link to="/admin/users">
          <Users size={18} />
          Người dùng
        </Link>
      </div>

      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-alert">{error}</div>}

      {confirmAction && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <div>
              <span>Xác nhận</span>
              <h2>{confirmAction.title}</h2>
              <p>{confirmAction.description}</p>
            </div>

            <div className="admin-modal-actions">
              <button
                className="admin-secondary-btn"
                disabled={actionLoading}
                onClick={() => setConfirmAction(null)}
              >
                Hủy
              </button>
              <button className="admin-danger-btn" disabled={actionLoading} onClick={runAction}>
                {actionLoading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="admin-panel">
        <form className="admin-filters" onSubmit={handleFilterSubmit}>
          <label>
            Thành phố
            <div className="admin-input-with-icon">
              <Search size={17} />
              <input
                value={filters.city}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, city: event.target.value }))
                }
                placeholder="Da Nang, Ha Noi..."
              />
            </div>
          </label>

          <label>
            Trạng thái
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value }))
              }
            >
              {hotelStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button className="admin-primary-btn">Lọc</button>
        </form>

        {loading ? (
          <div className="admin-loading">Đang tải khách sạn...</div>
        ) : hotels.length === 0 ? (
          <div className="admin-empty-inline">Không có khách sạn phù hợp.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Khách sạn</th>
                  <th>Thành phố</th>
                  <th>Chủ sở hữu</th>
                  <th>Trạng thái</th>
                  <th>Giá</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotelItem) => {
                  const status = hotelStatusMap[hotelItem.status] || {
                    label: hotelItem.status,
                    className: "status-default",
                  };

                  return (
                    <tr key={hotelItem._id}>
                      <td>
                        <strong>{hotelItem.name}</strong>
                        <span>{hotelItem._id}</span>
                      </td>
                      <td>{hotelItem.address?.city || "--"}</td>
                      <td>{hotelItem.owner?.email || "--"}</td>
                      <td>
                        <span className={`admin-status ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        {hotelItem.minPrice?.toLocaleString("vi-VN") || "--"} -{" "}
                        {hotelItem.maxPrice?.toLocaleString("vi-VN") || "--"}
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-icon-btn neutral"
                            title="Xem chi tiết"
                            onClick={() =>
                              navigate(`/admin/hotels/${hotelItem._id}`, {
                                state: { hotel: hotelItem },
                              })
                            }
                          >
                            <Eye size={17} />
                          </button>

                          {hotelItem.status === "pending" && (
                            <>
                              <button
                                className="admin-icon-btn success"
                                title="Duyệt"
                                onClick={() => openHotelAction(hotelItem, "approve")}
                              >
                                <CheckCircle2 size={17} />
                              </button>
                              <button
                                className="admin-icon-btn danger"
                                title="Từ chối"
                                onClick={() => openHotelAction(hotelItem, "reject")}
                              >
                                <XCircle size={17} />
                              </button>
                            </>
                          )}

                          {hotelItem.status === "approved" && (
                            <button
                              className="admin-icon-btn danger"
                              title="Block"
                              onClick={() => openHotelAction(hotelItem, "block")}
                            >
                              <Ban size={17} />
                            </button>
                          )}

                          {hotelItem.status === "blocked" && (
                            <button
                              className="admin-icon-btn success"
                              title="Unblock"
                              onClick={() => openHotelAction(hotelItem, "unblock")}
                            >
                              <Unlock size={17} />
                            </button>
                          )}

                          {!["pending", "approved", "blocked"].includes(hotelItem.status) && (
                            <span className="admin-muted">Không có</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          pagination={pagination}
          page={page}
          loading={loading}
          onPageChange={setPage}
        />
      </section>
    </main>
  );
}
