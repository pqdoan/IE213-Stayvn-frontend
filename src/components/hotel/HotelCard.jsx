import "../../styles/HotelCard.css";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(hotel);

    navigate(`/hotel/${hotel._id}`);
  };

  return (
    <div className="hotel-card" onClick={handleClick}>
      {/* IMAGE */}
      <div className="hotel-image-wrapper">
        <img
          src={hotel.image?.[0]?.url || import.meta.env.VITE_FALLBACK_IMAGE}
          alt={hotel.name}
          loading="lazy"
        />

        <div className="hotel-badge">Best choice</div>
      </div>

      {/* INFO */}
      <div className="hotel-info">
        <div className="hotel-top">
          <h3>{hotel.name}</h3>

          <div className="hotel-rating">
            ⭐ {hotel.avgRating != null ? hotel.avgRating.toFixed(1) : "4.0"}
          </div>
        </div>

        <p className="hotel-location">📍 {hotel.address?.city || "Việt Nam"}</p>

        <p className="hotel-description">
          {hotel.description
            ? hotel.description.slice(0, 90) + "..."
            : "Khách sạn cao cấp với đầy đủ tiện nghi hiện đại"}
        </p>

        {/* AMENITIES */}
        <div className="hotel-amenities">
          {hotel.amenities?.slice(0, 4).map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="hotel-bottom">
          <div className="hotel-price">
            {hotel.minPrice ? hotel.minPrice.toLocaleString() + "₫" : "Liên hệ"}

            <span>/ đêm</span>
          </div>

          <button className="hotel-btn">Xem chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
