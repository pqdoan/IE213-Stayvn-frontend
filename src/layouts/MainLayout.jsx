import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <div style={{ padding: "24px" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
