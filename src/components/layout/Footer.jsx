import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-col">
          <h2 className="footer-logo">StayVN</h2>
          <p>Nền tảng đặt phòng khách sạn cao cấp tại Việt Nam.</p>

          <div className="socials">
            <span>🌐</span>
            <span>📘</span>
            <span>📸</span>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-col">
          <h4>Khám phá</h4>
          <a>Khách sạn</a>
          <a>Địa điểm</a>
          <a>Ưu đãi</a>
        </div>

        <div className="footer-col">
          <h4>Công ty</h4>
          <a>Về chúng tôi</a>
          <a>Tuyển dụng</a>
          <a>Blog</a>
        </div>

        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <a>Trung tâm trợ giúp</a>
          <a>Chính sách</a>
          <a>Liên hệ</a>
        </div>

        {/* NEWS */}
        <div className="footer-col">
          <h4>Nhận ưu đãi</h4>
          <input placeholder="Nhập email..." />
          <Link to="/register" className="footer-register">
            Đăng ký
          </Link>
        </div>
      </div>

      <div className="footer-bottom">© 2026 StayVN · Privacy · Terms</div>
    </footer>
  );
};

export default Footer;
