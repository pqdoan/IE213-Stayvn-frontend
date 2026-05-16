/* ============================================== */
/* SEARCH SECTION */
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

import { useState } from "react";

import { useNavigate } from "react-router-dom";

const SearchSection = () => {
  const navigate = useNavigate();

  /* ==========================================
      STATES
  ========================================== */

  const [filters, setFilters] = useState({
    city: "",

    checkInDate: "",

    checkOutDate: "",

    guests: 1,

    stars: "",
  });

  /* ==========================================
      HANDLE CHANGE
  ========================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,

      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  /* ==========================================
      SEARCH
  ========================================== */

  const handleSearch = () => {
    /* DATE VALIDATE */

    if (
      filters.checkInDate &&
      filters.checkOutDate &&
      filters.checkInDate > filters.checkOutDate
    ) {
      alert("Ngày check-out phải sau check-in");

      return;
    }

    /* BUILD QUERY */

    const params = new URLSearchParams();

    if (filters.city.trim()) {
      params.append("city", filters.city);
    }

    if (filters.checkInDate) {
      params.append("checkInDate", filters.checkInDate);
    }

    if (filters.checkOutDate) {
      params.append("checkOutDate", filters.checkOutDate);
    }

    if (filters.guests) {
      params.append("guests", filters.guests);
    }

    if (filters.stars) {
      params.append("stars", filters.stars);
    }

    navigate(`/hotels?${params.toString()}`);
  };

  /* ==========================================
      RENDER
  ========================================== */

  return (
    <section className="search-section">
      <div className="search-overlay"></div>

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
          Việt Nam.
        </p>

        {/* SEARCH BAR */}

        <div className="search-bar">
          {/* CITY */}

          <div className="search-item">
            <MapPin size={20} />

            <input
              type="text"
              name="city"
              placeholder="Bạn muốn đi đâu?"
              value={filters.city}
              onChange={handleChange}
            />
          </div>

          {/* CHECK IN */}

          <div className="search-item">
            <CalendarDays size={20} />

            <input
              type="date"
              name="checkInDate"
              value={filters.checkInDate}
              onChange={handleChange}
            />
          </div>

          {/* CHECK OUT */}

          <div className="search-item">
            <CalendarDays size={20} />

            <input
              type="date"
              name="checkOutDate"
              value={filters.checkOutDate}
              onChange={handleChange}
            />
          </div>

          {/* GUESTS */}

          <div className="search-item">
            <Users size={20} />

            <select
              name="guests"
              value={filters.guests}
              onChange={handleChange}
            >
              <option value={1}>1 khách</option>

              <option value={2}>2 khách</option>

              <option value={3}>3 khách</option>

              <option value={4}>4+ khách</option>
            </select>
          </div>

          {/* STARS */}

          <div className="search-item">
            <Star size={20} />

            <select name="stars" value={filters.stars} onChange={handleChange}>
              <option value="">Tất cả hạng sao</option>

              <option value="3">3 sao</option>

              <option value="4">4 sao</option>

              <option value="5">5 sao</option>
            </select>
          </div>

          {/* BUTTON */}

          <button className="search-btn" onClick={handleSearch}>
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
