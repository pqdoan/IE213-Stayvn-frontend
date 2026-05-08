import HotelCard from "./HotelCard";

const HotelGrid = ({ hotels }) => {
  return (
    <section className="hotels">
      <h2>Khách sạn nổi bật</h2>

      <div className="hotel-grid">
        {hotels.length > 0 ? (
          hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
        ) : (
          <p>Không có khách sạn</p>
        )}
      </div>
    </section>
  );
};

export default HotelGrid;
