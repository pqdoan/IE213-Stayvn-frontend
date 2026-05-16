/* ==============================================
   HOTEL DETAIL PAGE
============================================== */

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import hotelService from "../services/hotelService";
import { useHotelContext } from "../context/HotelContext";

import "../styles/HotelDetail.css";

const HotelDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const { setHotel: setCurrentHotel } = useHotelContext();

  /* ==============================================
      FETCH HOTEL
  ============================================== */

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await hotelService.getById(id);

        const hotelData = response?.data?.data;

        if (!hotelData) {
          setError("Không tìm thấy khách sạn");
          setCurrentHotel(null);
          return;
        }

        setHotel(hotelData);
        setCurrentHotel(hotelData);
      } catch (err) {
        console.log(err);
        setCurrentHotel(null);

        setError(
          err?.response?.data?.message || "Không thể tải chi tiết khách sạn",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotel();
    }
  }, [id]);

  /* ==============================================
      LOADING
  ============================================== */

  if (loading) {
    return (
      <div className="hotel-detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  /* ==============================================
      ERROR
  ============================================== */

  if (error) {
    return (
      <div className="hotel-detail-error">
        <h2>{error}</h2>

        <button onClick={() => navigate("/hotels")}>Quay lại</button>
      </div>
    );
  }

  /* ==============================================
      NO HOTEL
  ============================================== */

  if (!hotel) {
    return (
      <div className="hotel-detail-error">
        <h2>Không tìm thấy khách sạn</h2>
      </div>
    );
  }

  return (
    <div className="hotel-detail-page">
      {/* HERO */}

      <section className="hotel-detail-hero">
        <img
          src={
            hotel.image?.[0]?.url ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"
          }
          alt={hotel.name}
        />

        <div className="hotel-detail-overlay">
          <div className="hotel-detail-hero-content">
            <div className="hotel-detail-badge">Best Choice</div>

            <h1>{hotel.name}</h1>

            <div className="hotel-detail-location">
              📍 {hotel.address?.city || "Việt Nam"}
            </div>

            <div className="hotel-detail-stars">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < Math.floor(hotel.avgRating ?? 4) ? "⭐" : "☆"}
                </span>
              ))}

              <span className="hotel-detail-rating-number">
                {hotel.avgRating != null ? hotel.avgRating.toFixed(1) : "4.0"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}

      <div className="hotel-detail-container">
        {/* LEFT */}

        <div className="hotel-detail-main">
          {/* DESCRIPTION */}

          <div className="hotel-detail-section">
            <h2>Mô tả</h2>

            <p>
              {hotel.description ||
                "Khách sạn cao cấp với đầy đủ tiện nghi hiện đại."}
            </p>
          </div>

          {/* AMENITIES */}

          <div className="hotel-detail-section">
            <h2>Tiện ích</h2>

            <div className="hotel-detail-amenities">
              {hotel.amenities && hotel.amenities.length > 0 ? (
                hotel.amenities.map((item, index) => (
                  <div key={index} className="hotel-detail-amenity">
                    ✓ {item}
                  </div>
                ))
              ) : (
                <p>Chưa có tiện ích</p>
              )}
            </div>
          </div>

          {/* GALLERY */}

          <div className="hotel-detail-section">
            <h2>Hình ảnh khách sạn</h2>

            <div className="hotel-detail-gallery">
              {hotel.image && hotel.image.length > 0 ? (
                hotel.image.map((img, index) => (
                  <img key={index} src={img.url} alt={`hotel-${index}`} />
                ))
              ) : (
                <p>Chưa có hình ảnh</p>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}

        <aside className="hotel-detail-sidebar">
          <div className="booking-card">
            <div className="booking-price">
              {hotel.minPrice ? hotel.minPrice.toLocaleString() : "850.000"}₫
              <span>/ đêm</span>
            </div>

            <div className="booking-meta">
              <div>
                <strong>Check-in</strong>

                <p>{hotel.checkInTime || "14:00"}</p>
              </div>

              <div>
                <strong>Check-out</strong>

                <p>{hotel.checkOutTime || "12:00"}</p>
              </div>
            </div>

            <button
              className="booking-btn"
              onClick={() =>
                navigate("/booking", {
                  state: {
                    hotel,
                  },
                })
              }
            >
              Đặt phòng ngay
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HotelDetail;
