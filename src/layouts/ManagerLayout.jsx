import React from "react";
import ManagerSidebar from "../components/layout/ManagerSidebar";

const ManagerLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <ManagerSidebar />
      <div style={{ flex: 1, padding: "20px", marginLeft: "250px", marginTop: "70px" }}>
        {children}
      </div>
    </div>
  );
};

export default ManagerLayout;
