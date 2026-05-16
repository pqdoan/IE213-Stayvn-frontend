import HotelCard from "./HotelCard";
import "../../styles/HotelGrid.css";

const HotelGrid = ({ hotels, loading, error }) => {
  // LOADING
  if (loading) {
    return (
      <div className="hotel-grid">
        {[...Array(6)].map((_, index) => (
          <div className="hotel-skeleton" key={index}></div>
        ))}
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="hotel-error">
        <h3>Đã có lỗi xảy ra</h3>
        <p>{error}</p>
      </div>
    );
  }

  // EMPTY
  if (!hotels.length) {
    return (
      <div className="hotel-empty">
        <h3>Không tìm thấy khách sạn</h3>
        <p>Hãy thử tìm kiếm với bộ lọc khác.</p>
      </div>
    );
  }

  // SUCCESS
  return (
    <section className="hotels">
      <h2>Khách sạn nổi bật</h2>
      <div className="hotel-grid">
        {hotels.slice(0, 4).map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </section>
  );
};

export default HotelGrid;
