/*    ===== HEADER =====   */

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useHotelContext } from "../../context/HotelContext";
import "./Header.css";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { hotel } = useHotelContext();
  const hotelDetailPath = hotel ? `/hotel/${hotel._id}` : "/hotels";

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
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/hotels"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Khách sạn
          </NavLink>

          <NavLink
            to={hotelDetailPath}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Chi tiết KS
          </NavLink>

          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Đặt phòng
          </NavLink>

          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Booking của tôi
          </NavLink>

          <NavLink
            to="/manager"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Quản lý KS
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
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
                <Link to="/manager">Quản lý KS</Link>
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
