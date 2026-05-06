import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
