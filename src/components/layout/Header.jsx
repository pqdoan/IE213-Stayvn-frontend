/*    ===== HEADER =====   */

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* LEFT: Logo */}
        <div className="header-left">
          <Link to="/" className="logo">
            StayVN
          </Link>
        </div>

        {/* CENTER: Navigation */}
        <nav className="nav">
          <NavLink to="/" className="nav-link">
            Trang chủ
          </NavLink>
          <NavLink to="/hotels" className="nav-link">
            Khách sạn
          </NavLink>
          <NavLink to="/offers" className="nav-link">
            Chi tiết KS
          </NavLink>
          <NavLink to="/booking" className="nav-link">
            Đặt phòng
          </NavLink>
          <NavLink to="/my-bookings" className="nav-link">
            Booking của tôi
          </NavLink>
          <NavLink to="/hotel-manager" className="nav-link">
            Quản lý KS
          </NavLink>
          <NavLink to="/admin" className="nav-link">
            Admin
          </NavLink>
        </nav>

        {/* RIGHT: Auth + User */}
        <div className="header-right">
          <Link to="/register" className="btn-gold">
            Đăng ký
          </Link>
          <Link to="/login" className="btn-out">
            Đăng nhập
          </Link>

          <div className="user">
            <div className="avatar" onClick={() => setOpenMenu(!openMenu)}>
              U
            </div>
            {openMenu && (
              <div className="user-dropdown">
                <Link to="/profile">Hồ sơ</Link>
                <Link to="/my-bookings">Booking của tôi</Link>
                <Link to="/hotel-manager">Quản lý KS</Link>
                <Link to="/admin">Admin</Link>
                <div className="divider"></div>
                <button>Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
