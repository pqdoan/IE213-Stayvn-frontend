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
          <NavLink to="/contact" className="nav-link">
            Đặt phòng
          </NavLink>
          <NavLink to="/offers" className="nav-link">
            Booking của tôi
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Quản lý KS
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Admin
          </NavLink>
        </nav>

        {/* RIGHT: Auth + User */}
        <div className="header-right">
          <button className="btn-outline">Đăng nhập</button>
          <button className="btn-gold">Đăng ký</button>

          {/* Avatar dropdown cho user đã đăng nhập */}
          <div className="user">
            <div className="avatar" onClick={() => setOpenMenu(!openMenu)}>
              U
            </div>
            {openMenu && (
              <div className="user-dropdown">
                <Link to="/profile">Hồ sơ</Link>
                <Link to="/my-bookings">Booking của tôi</Link>
                <Link to="/manager">Quản lý KS</Link>
                <Link to="/admin">Admin</Link>
                <div className="divider"></div>
                <button>Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="search-section">
        <h2>Nền tảng đặt phòng khách sạn</h2>
        <h1>Tìm nơi lưu trú hoàn hảo</h1>
        <p>
          Khám phá hàng trăm khách sạn cao cấp trên khắp Việt Nam – đặt phòng
          nhanh chóng, giá tốt, dịch vụ tận tâm.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Địa điểm (VD: Nha Trang, Đà Nẵng...)"
          />
          <input type="date" />
          <input type="date" />
          <select>
            <option>1 khách</option>
            <option>2 khách</option>
            <option>3 khách</option>
            <option>4+ khách</option>
          </select>
          <select>
            <option>Tất cả hạng sao</option>
            <option>3 sao</option>
            <option>4 sao</option>
            <option>5 sao</option>
          </select>
          <button className="btn-gold">Tìm kiếm</button>
        </div>

        {/* CTA bổ sung */}
        <div className="cta-buttons">
          <button className="btn-outline">Khám phá ưu đãi</button>
          <button className="btn-gold">Top khách sạn</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
