/* ============================================== */
/*  HOTEL FILTER */
/* ============================================== */

import "./HotelFilter.css";

const amenitiesList = ["Wifi", "Hồ bơi", "Gym", "Nhà hàng", "Spa"];

const HotelFilter = ({ filters, setFilters }) => {
  const handleAmenityChange = (amenity) => {
    if (filters.amenities.includes(amenity)) {
      // bỏ chọn tiện ích
      setFilters({
        ...filters,
        amenities: filters.amenities.filter((item) => item !== amenity),
      });
    } else {
      // thêm tiện ích
      setFilters({
        ...filters,
        amenities: [...filters.amenities, amenity],
      });
    }
  };

  return (
    <div className="hotel-filter">
      <div className="filter-group">
        <label>Thành phố</label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          placeholder="VD: Đà Nẵng"
        />
      </div>

      <div className="filter-group">
        <label>Giá thấp nhất</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Giá cao nhất</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Tiện ích</label>
        <div className="amenities-filter">
          {amenitiesList.map((item, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={filters.amenities.includes(item)}
                onChange={() => handleAmenityChange(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelFilter;
