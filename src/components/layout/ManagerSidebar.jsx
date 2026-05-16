import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const ManagerSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>🏨 Manager</h3>
      </div>

      <div className="sidebar-menu">
        <Link to="/manager" className="sidebar-item">
          📊 Dashboard
        </Link>
        <Link to="/manager" className="sidebar-item">
          📋 Quản lý Booking
        </Link>
        <Link to="/manager" className="sidebar-item">
          🛏️ Quản lý Phòng
        </Link>
        <Link to="/manager" className="sidebar-item">
          ✨ Quản lý Dịch vụ
        </Link>
        <Link to="/manager" className="sidebar-item">
          🏨 Thông tin KS
        </Link>
        <Link to="/" className="sidebar-item">
          🏠 Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default ManagerSidebar;
