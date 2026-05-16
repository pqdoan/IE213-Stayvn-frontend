import { Link } from "react-router-dom";
import "./Sidebar.css";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>🛡️ Admin</h3>
      </div>

      <div className="sidebar-menu">
        <Link to="/admin?tab=hotels" className="sidebar-item">
          🏨 Quản lý Khách sạn
        </Link>
        <Link to="/admin?tab=users" className="sidebar-item">
          👥 Quản lý Người dùng
        </Link>
        <Link to="/admin?tab=stats" className="sidebar-item">
          📊 Thống kê
        </Link>
        <Link to="/" className="sidebar-item">
          🏠 Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
