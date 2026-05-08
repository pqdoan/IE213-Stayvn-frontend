const HotelCard = ({ hotel }) => {
  return (
    <div className="hotel-card">
      {/* IMAGE */}
      <img
        src={hotel.image?.[0]?.url || "https://via.placeholder.com/300x200"}
        alt={hotel.name}
      />

      {/* INFO */}
      <div className="hotel-info">
        <h3>{hotel.name}</h3>

        <p className="location"> {hotel.address?.city || "Việt Nam"}</p>

        {/* AMENITIES */}
        <div className="amenities">
          {hotel.amenities?.slice(0, 3).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>

        {/* PRICE */}
        <div className="price">
          {hotel.minPrice
            ? hotel.minPrice.toLocaleString() + "₫ / đêm"
            : "Liên hệ"}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
