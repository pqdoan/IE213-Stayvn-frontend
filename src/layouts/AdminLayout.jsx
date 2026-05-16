import React from "react";
import AdminSidebar from "../components/layout/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "20px", marginLeft: "250px", marginTop: "70px" }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
