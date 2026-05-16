/* ============================================== */
/*  HOTELS PAGE */
/* ============================================== */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import hotelService from "../services/hotelService";

import "../styles/Hotels.css";

const Hotels = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  /* =====================================================
      SEARCH PARAMS
  ===================================================== */

  const cityParam = searchParams.get("city") || "";
  const guestsParam = searchParams.get("guests") || 1;
  const checkInParam = searchParams.get("checkInDate") || "";
  const checkOutParam = searchParams.get("checkOutDate") || "";
  const starsParam = searchParams.get("stars") || "";

  /* =====================================================
      STATES
  ===================================================== */

  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    city: cityParam,
    guests: guestsParam,
    checkInDate: checkInParam,
    checkOutDate: checkOutParam,
    stars: starsParam,

    minPrice: "",
    maxPrice: "",

    amenities: [],

    sort: "recommended",
    guestDropdownOpen: false,
  });

  /* =====================================================
    FETCH HOTELS
===================================================== */

  const fetchHotels = async () => {
    try {
      setLoading(true);

      setError("");

      /* BUILD PARAMS */

      const params = {
        city: filters.city?.trim() || "",

        guests: Number(filters.guests) || 1,

        checkInDate: filters.checkInDate || "",

        checkOutDate: filters.checkOutDate || "",

        minPrice: filters.minPrice || "",

        maxPrice: filters.maxPrice || "",

        amenities:
          filters.amenities.length > 0 ? filters.amenities.join(",") : "",

        stars: filters.stars || "",
        page: 1,

        limit: 20,
      };

      /* API */

      const response = await hotelService.getAll(params);

      let hotelsData = response?.data?.data?.hotels || [];

      /* CLONE ARRAY BEFORE SORT */

      hotelsData = [...hotelsData];

      /* SORT */

      switch (filters.sort) {
        case "price-low":
          hotelsData.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
          break;

        case "price-high":
          hotelsData.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
          break;

        default:
          break;
      }

      /* SET DATA */

      setHotels(hotelsData);
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.message || "Không thể tải danh sách khách sạn",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
    SYNC FILTERS WITH URL
===================================================== */

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,

      city: searchParams.get("city") || "",

      guests: Number(searchParams.get("guests")) || 1,

      checkInDate: searchParams.get("checkInDate") || "",

      checkOutDate: searchParams.get("checkOutDate") || "",

      stars: searchParams.get("stars") || "",
    }));
  }, [searchParams]);

  /* =====================================================
    FETCH WHEN FILTERS CHANGE
===================================================== */

  useEffect(() => {
    fetchHotels();
  }, [
    filters.city,

    filters.guests,

    filters.checkInDate,

    filters.checkOutDate,

    filters.stars,

    filters.minPrice,

    filters.maxPrice,

    filters.sort,

    filters.amenities,
  ]);

  /* =====================================================
      HANDLERS
  ===================================================== */

  const handleAmenityChange = (value) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(value);

      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== value)
          : [...prev.amenities, value],
      };
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.city) {
      params.append("city", filters.city);
    }

    if (filters.guests) {
      params.append("guests", filters.guests);
    }

    if (filters.checkInDate) {
      params.append("checkInDate", filters.checkInDate);
    }

    if (filters.checkOutDate) {
      params.append("checkOutDate", filters.checkOutDate);
    }

    if (filters.stars) {
      params.append("stars", filters.stars);
    }

    navigate(`/hotels?${params.toString()}`);
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  /* =====================================================
      RENDER
  ===================================================== */

  return (
    <div className="hotels-page">
      {/* =====================================================
            TOPBAR SEARCH
      ===================================================== */}

      <section className="hotels-topbar">
        <div className="hotels-topbar-inner">
          {/* SEARCH FORM */}

          <div className="hotels-search-form">
            {/* CITY */}

            <div className="search-box">
              <input
                type="text"
                className="search-location"
                placeholder="Bạn muốn đi đâu?"
                value={filters.city}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    city: e.target.value,
                  })
                }
              />
            </div>

            {/* CHECK IN */}

            <div className="search-box">
              <input
                type="date"
                className="search-date"
                value={filters.checkInDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    checkInDate: e.target.value,
                  })
                }
              />
            </div>

            {/* CHECK OUT */}

            <div className="search-box">
              <input
                type="date"
                className="search-date"
                value={filters.checkOutDate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    checkOutDate: e.target.value,
                  })
                }
              />
            </div>

            {/* GUESTS */}

            <div className="guest-dropdown">
              <div
                className="guest-dropdown-selected"
                onClick={() =>
                  setFilters({
                    ...filters,
                    guestDropdownOpen: !filters.guestDropdownOpen,
                  })
                }
              >
                <span>{filters.guests} khách</span>

                <span className="dropdown-arrow">⌄</span>
              </div>

              {filters.guestDropdownOpen && (
                <div className="guest-dropdown-menu">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className={`guest-option ${
                        filters.guests == item ? "active" : ""
                      }`}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          guests: item,
                          guestDropdownOpen: false,
                        })
                      }
                    >
                      {item === 4 ? "4+ khách" : `${item} khách`}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STARS */}

            <div className="search-box">
              <select
                className="search-select"
                value={filters.stars}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    stars: e.target.value,
                  })
                }
              >
                <option value="">Tất cả hạng sao</option>

                <option value="3">3 sao</option>

                <option value="4">4 sao</option>

                <option value="5">5 sao</option>
              </select>
            </div>

            {/* BUTTON */}

            <button className="search-btn" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>

          {/* FOUND */}

          <div className="hotel-found">Tìm thấy {hotels.length} khách sạn</div>
        </div>
      </section>

      {/* =====================================================
            MAIN LAYOUT
      ===================================================== */}

      <div className="hotels-layout">
        {/* =====================================================
              SIDEBAR
        ===================================================== */}

        <aside className="hotels-sidebar">
          <h2 className="sidebar-title">Bộ lọc</h2>

          {/* PRICE */}

          <div className="filter-group">
            <h4>Khoảng giá / đêm</h4>

            <div className="price-inputs">
              <input
                type="number"
                placeholder="300.000"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minPrice: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="2.000.000"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* AMENITIES */}

          <div className="filter-group">
            <h4>Tiện ích</h4>

            <div className="checkbox-list">
              {["WiFi", "Pool", "Parking", "Restaurant", "Spa", "Gym"].map(
                (item) => (
                  <label key={item} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(item)}
                      onChange={() => handleAmenityChange(item)}
                    />

                    <span>{item}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          {/* SORT */}

          <div className="filter-group">
            <h4>Sắp xếp</h4>

            <select
              className="sort-select"
              value={filters.sort}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sort: e.target.value,
                })
              }
            >
              <option value="recommended">Đề xuất</option>

              <option value="price-low">Giá thấp → cao</option>

              <option value="price-high">Giá cao → thấp</option>
            </select>
          </div>

          <button className="apply-btn" onClick={handleSearch}>
            Áp dụng
          </button>
        </aside>

        {/* =====================================================
              CONTENT
        ===================================================== */}

        <main className="hotels-content">
          {/* SORT BAR */}

          <div className="hotels-sortbar">
            <div>
              <h2 className="sort-title">
                {hotels.length} khách sạn được tìm thấy
              </h2>

              <p className="sort-subtitle">
                Giá tốt nhất cho chuyến đi của bạn
              </p>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                background: "#ffe5e5",
                padding: "16px",
                borderRadius: "12px",
                color: "#d00000",
                fontWeight: "600",
              }}
            >
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="hotels-loading">
              <div className="loading-spinner"></div>
            </div>
          )}

          {/* EMPTY */}

          {!loading && hotels.length === 0 && (
            <div
              style={{
                padding: "50px",
                background: "white",
                borderRadius: "24px",
                textAlign: "center",
              }}
            >
              <h2>Không tìm thấy khách sạn</h2>
            </div>
          )}

          {/* HOTEL LIST */}

          <div className="hotels-list">
            {!loading &&
              hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="hotel-row-card"
                  onClick={() => handleHotelClick(hotel._id)}
                >
                  {/* IMAGE */}

                  <div className="hotel-image-wrapper">
                    <img
                      className="hotel-image"
                      src={
                        hotel.image?.[0]?.url ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"
                      }
                      alt={hotel.name}
                    />

                    <div className="hotel-badge">
                      ⭐{" "}
                      {hotel.avgRating != null
                        ? hotel.avgRating.toFixed(1)
                        : "4.8"}
                    </div>
                  </div>

                  {/* INFO */}

                  <div className="hotel-main">
                    <div className="hotel-stars">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index}>
                          {index < Math.floor(hotel.avgRating ?? 4)
                            ? "⭐"
                            : "☆"}
                        </span>
                      ))}

                      <span className="hotel-rating-number">
                        {hotel.avgRating != null
                          ? hotel.avgRating.toFixed(1)
                          : "4.0"}
                      </span>
                    </div>

                    <h2 className="hotel-name">{hotel.name}</h2>

                    <div className="hotel-location">
                      📍 {hotel.address?.city || "Việt Nam"}
                    </div>

                    <p className="hotel-description">{hotel.description}</p>

                    <div className="hotel-amenities">
                      {hotel.amenities?.slice(0, 5).map((item, index) => (
                        <span key={index}>{item}</span>
                      ))}
                    </div>
                  </div>

                  {/* PRICE */}

                  <div className="hotel-price-box">
                    <div className="hotel-price-label">Từ</div>

                    <div className="hotel-price">
                      {hotel.minPrice
                        ? hotel.minPrice.toLocaleString()
                        : "850.000"}
                      ₫<span>/ đêm</span>
                    </div>

                    <div className="hotel-available">✓ Còn phòng trống</div>

                    <button className="hotel-view-btn">Xem chi tiết</button>
                  </div>
                </div>
              ))}
          </div>

          {/* PAGINATION */}

          <div className="hotels-pagination">
            <button className="page-btn active">1</button>

            <button className="page-btn">2</button>

            <button className="page-btn">3</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hotels;
