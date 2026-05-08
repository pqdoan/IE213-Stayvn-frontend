/*   ======= SEARCH SECTION =====   */

import "./SearchSection.css";

const SearchSection = () => {
  return (
    <div className="search-section">
      <h2>Nền tảng đặt phòng khách sạn</h2>
      <h1>Tìm nơi lưu trú hoàn hảo</h1>
      <p>
        Khám phá hàng trăm khách sạn cao cấp trên khắp Việt Nam – đặt phòng
        nhanh chóng, giá tốt, dịch vụ tận tâm.
      </p>

      <div className="search-bar">
        <input type="text" placeholder="Địa điểm ( Nha Trang, Đà Nẵng...)" />
        <input type="date" />
        <input type="date" />
        <select>
          <option>1 khách</option>
          <option>2 khách</option>
          <option>3 khách</option>
          <option>4+ khách</option>
        </select>
        <select>
          <option>Tất cả hạng sao</option>
          <option>3 sao</option>
          <option>4 sao</option>
          <option>5 sao</option>
        </select>
        <button className="btn-gold">Tìm kiếm</button>
      </div>

      <div className="cta-buttons">
        <button className="btn-outline">Khám phá ưu đãi</button>
        <button className="btn-gold">Top khách sạn</button>
      </div>
    </div>
  );
};

export default SearchSection;
