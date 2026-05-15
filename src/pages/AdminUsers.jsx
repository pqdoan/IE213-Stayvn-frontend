import { useEffect, useMemo, useState } from "react";
import { Ban, Hotel, RefreshCw, Shield, Unlock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import adminService from "../services/adminService";
import "./AdminPanel.css";

const PAGE_SIZE = 10;

const userStatusMap = {
  active: { label: "Đang hoạt động", className: "status-success" },
  blocked: { label: "Đã block", className: "status-danger" },
};

const userRoleMap = {
  admin: "Quản trị viên",
  customer: "Khách hàng",
  hotel_manager: "Quản lý khách sạn",
};

const formatUserRoles = (roles = []) => {
  const roleList = Array.isArray(roles) ? roles : [roles];
  return roleList.map((role) => userRoleMap[role] || role).filter(Boolean).join(", ");
};

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

export default function AdminUsers() {
  const storedUser = useMemo(getLocalUser, []);
  const isAdmin = useMemo(() => getRoles(storedUser).includes("admin"), [storedUser]);

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchUsers = async (nextPage = page) => {
    try {
      setLoading(true);
      setError("");

      const res = await adminService.getUsers({
        page: nextPage,
        limit: PAGE_SIZE,
      });

      const data = res.data?.data || {};
      setUsers(data.users || []);
      setPagination(
        data.pagination || {
          total: 0,
          page: nextPage,
          limit: PAGE_SIZE,
          totalPages: 1,
        },
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers(page);
  }, [page, isAdmin]);

  const openUserAction = (user, nextStatus) => {
    const isBlocking = nextStatus === "blocked";

    setConfirmAction({
      title: isBlocking ? "Block người dùng?" : "Unblock người dùng?",
      description: `${user.email} sẽ được chuyển sang trạng thái ${
        isBlocking ? "blocked" : "active"
      }.`,
      run: () => adminService.updateUserStatus(user._id, nextStatus),
      successMessage: isBlocking
        ? "Block người dùng thành công."
        : "Unblock người dùng thành công.",
      errorMessage: isBlocking
        ? "Không thể block người dùng."
        : "Không thể unblock người dùng.",
    });
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
      await fetchUsers(page);
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
          <h1>Quản lý người dùng</h1>
          <p>Xem danh sách tài khoản, khóa và mở khóa người dùng.</p>
        </div>

        <button className="admin-secondary-btn" disabled={loading} onClick={() => fetchUsers(page)}>
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      <div className="admin-tabs">
        <Link to="/admin/hotels">
          <Hotel size={18} />
          Khách sạn
        </Link>
        <Link className="active" to="/admin/users">
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
        {loading ? (
          <div className="admin-loading">Đang tải người dùng...</div>
        ) : users.length === 0 ? (
          <div className="admin-empty-inline">Không có người dùng để hiển thị.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const status = userStatusMap[user.status] || {
                    label: user.status,
                    className: "status-default",
                  };

                  return (
                    <tr key={user._id}>
                      <td>
                        <strong>
                          {[user.firstName, user.lastName].filter(Boolean).join(" ") || "--"}
                        </strong>
                        <span>{user._id}</span>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || "--"}</td>
                      <td>{formatUserRoles(user.role) || "--"}</td>
                      <td>
                        <span className={`admin-status ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        {user.status === "blocked" ? (
                          <button
                            className="admin-icon-btn success"
                            title="Unblock"
                            onClick={() => openUserAction(user, "active")}
                          >
                            <Unlock size={17} />
                          </button>
                        ) : (
                          <button
                            className="admin-icon-btn danger"
                            title="Block"
                            onClick={() => openUserAction(user, "blocked")}
                          >
                            <Ban size={17} />
                          </button>
                        )}
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
