import React from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import hotelService from "../services/hotelService";

export default function ManagerServices() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = React.useState(null);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    if (!hotelId) return;
    hotelService.getHotelById(hotelId)
      .then((h) => mounted && setHotel(h))
      .catch(() => mounted && setHotel(null));

    import("../services/serviceService").then((m) => {
      m.default.getServicesByHotel(hotelId).then((s) => mounted && setServices(s)).catch(() => {});
    });

    return () => (mounted = false);
  }, [hotelId]);

  return (
    <div className="manager-dashboard">
      <section className="manager-page-header">
        <div>
          <p className="eyebrow">Quản lý dịch vụ</p>
          <h1>Dịch vụ của {hotel?.name || "..."}</h1>
          <p>Thêm, sửa dịch vụ đi kèm và cài đặt giá từng dịch vụ.</p>
        </div>
        <Button className="manager-card-link">Thêm dịch vụ</Button>
      </section>

      <Card className="management-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Thêm / sửa dịch vụ</p>
            <h2>Dịch vụ đi kèm</h2>
          </div>
        </div>

        <form className="manager-form form-grid-2">
          <label>
            Tên dịch vụ
            <input placeholder="Ăn sáng, Spa, Đưa đón..." />
          </label>
          <label>
            Giá dịch vụ
            <input placeholder="180.000đ/người" />
          </label>
          <label>
            Trạng thái
            <select defaultValue="Đang bán">
              <option>Đang bán</option>
              <option>Tạm ẩn</option>
            </select>
          </label>
          <Button type="button">Lưu dịch vụ</Button>
        </form>
      </Card>

      <section className="management-card">
        <div className="manager-table">
          <div className="table-row table-head service-row">
            <span>Tên dịch vụ</span>
            <span>Giá</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          {services.map((service) => (
            <div className="table-row service-row" key={service.name}>
              <strong>{service.name}</strong>
              <span>{service.price}</span>
              <span className="status-pill">{service.status}</span>
              <span className="row-actions">
                <Button variant="outline" type="button">Sửa</Button>
                <Button variant="danger" type="button">Xóa</Button>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
