/* ============================================== */
/*  SEARCH SECTION */
/* ============================================== */

import "./SearchSection.css";
import {
  MapPin,
  CalendarDays,
  Users,
  Star,
  Search,
  Sparkles,
} from "lucide-react";

const SearchSection = () => {
  return (
    <section className="search-section">
      {/* OVERLAY */}
      <div className="search-overlay"></div>

      {/* FLOATING EFFECT */}
      <div className="floating-circle circle-1"></div>
      <div className="floating-circle circle-2"></div>

      <div className="search-content">
        {/* BADGE */}
        <div className="hero-badge">
          <Sparkles size={18} />
          <span>Nền tảng đặt phòng cao cấp tại Việt Nam</span>
        </div>

        {/* TITLE */}
        <h2>TRẢI NGHIỆM DU LỊCH ĐẲNG CẤP</h2>

        <h1>
          Tìm nơi lưu trú
          <span> hoàn hảo </span>
          cho chuyến đi của bạn
        </h1>

        <p>
          Khám phá hàng nghìn khách sạn, resort và homestay cao cấp trên toàn
          Việt Nam với mức giá tốt nhất, đặt phòng nhanh chóng và hỗ trợ 24/7.
        </p>

        {/* SEARCH BAR */}
        <div className="search-bar">
          {/* LOCATION */}
          <div className="search-item">
            <MapPin size={20} />
            <input type="text" placeholder="Bạn muốn đi đâu?" />
          </div>

          {/* CHECKIN */}
          <div className="search-item">
            <CalendarDays size={20} />
            <input type="date" />
          </div>

          {/* CHECKOUT */}
          <div className="search-item">
            <CalendarDays size={20} />
            <input type="date" />
          </div>

          {/* GUEST */}
          <div className="search-item">
            <Users size={20} />
            <select>
              <option>1 khách</option>
              <option>2 khách</option>
              <option>3 khách</option>
              <option>4+ khách</option>
            </select>
          </div>

          {/* STAR */}
          <div className="search-item">
            <Star size={20} />
            <select>
              <option>Tất cả hạng sao</option>
              <option>3 sao</option>
              <option>4 sao</option>
              <option>5 sao</option>
            </select>
          </div>

          {/* BUTTON */}
          <button className="search-btn">
            <Search size={20} />
            <span>Tìm kiếm</span>
          </button>
        </div>

        {/* CTA */}
        <div className="cta-buttons">
          <button className="btn-outline1">Khám phá ưu đãi</button>

          <button className="btn-gold1">Top khách sạn</button>
        </div>

        {/* STATS */}
        <div className="hero-stats">
          <div className="hero-stat-card">
            <h3>10K+</h3>
            <p>Khách sạn toàn quốc</p>
          </div>

          <div className="hero-stat-card">
            <h3>50K+</h3>
            <p>Khách hàng hài lòng</p>
          </div>

          <div className="hero-stat-card">
            <h3>24/7</h3>
            <p>Hỗ trợ khách hàng</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
