import React from "react";

const ManagerSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Manager Panel</h3>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-item active">📊 Dashboard</div>
        <div className="sidebar-item">🏨 Thông tin KS</div>
        <div className="sidebar-item">🛏️ Phòng</div>
        <div className="sidebar-item">📋 Booking</div>
        <div className="sidebar-item">✨ Dịch vụ</div>
      </div>
    </div>
  );
};

export default ManagerSidebar;
