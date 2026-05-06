import React from "react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <div className="sidebar-item active">🏨 Duyệt khách sạn</div>
      <div className="sidebar-item">👥 Người dùng</div>
      <div className="sidebar-item">📊 Thống kê</div>
    </div>
  );
};

export default Sidebar;
