import { useState, useEffect } from "react";
import "../styles/ManagerDashboard.css";
import bookingService from "../services/bookingService";
import roomService from "../services/roomService";
import serviceService from "../services/serviceService";
import hotelManagementService from "../services/hotelManagementService";

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [hotelInfo, setHotelInfo] = useState({
    name: "",
    address: { street: "", city: "", country: "" },
    description: "",
    image: [],
    amenities: [],
  });
  const [hotelId, setHotelId] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: "",
    price: 0,
    capacity: 1,
    quantity: 1,
    description: "",
  });
  const [newService, setNewService] = useState({
    name: "",
    price: 0,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch manager's hotel first
  useEffect(() => {
    getManagerHotel();
  }, []);

  // Fetch data when hotelId is available
  useEffect(() => {
    if (hotelId) {
      fetchBookings();
      fetchRooms();
      fetchServices();
      fetchHotelInfo();
    }
  }, [hotelId]);

  const getManagerHotel = async () => {
    try {
      const res = await hotelManagementService.getMyHotels();
      if (res.data.data) {
        setHotelId(res.data.data._id);
      } else {
        setError("Không tìm thấy khách sạn của bạn");
      }
    } catch (err) {
      setError("Lỗi tải thông tin khách sạn");
      console.error(err);
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await hotelManagementService.updateHotelInfo(hotelInfo);
      setHotelInfo(res.data.data || hotelInfo);
      alert("Cập nhật thông tin khách sạn thành công");
    } catch (err) {
      setError("Không thể cập nhật thông tin khách sạn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelFieldChange = (field, value) => {
    setHotelInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setHotelInfo((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleAmenityAdd = (amenity) => {
    if (!amenity) return;
    setHotelInfo((prev) => ({
      ...prev,
      amenities: [...(prev.amenities || []), amenity],
    }));
  };

  const handleAmenityRemove = (amenity) => {
    setHotelInfo((prev) => ({
      ...prev,
      amenities: (prev.amenities || []).filter((item) => item !== amenity),
    }));
  };

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      await roomService.createRoom(newRoom);
      setNewRoom({
        name: "",
        price: 0,
        capacity: 1,
        quantity: 1,
        description: "",
      });
      fetchRooms();
      alert("Tạo phòng thành công");
    } catch (err) {
      setError("Không thể tạo phòng mới");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
      return;
    }

    try {
      await roomService.deleteRoom(roomId);
      setRooms((prev) => prev.filter((room) => room._id !== roomId));
    } catch (err) {
      setError("Không thể xóa phòng");
      console.error(err);
    }
  };

  const handleCreateService = async () => {
    try {
      setLoading(true);
      await serviceService.createService(newService);
      setNewService({ name: "", price: 0, description: "" });
      fetchServices();
      alert("Tạo dịch vụ thành công");
    } catch (err) {
      setError("Không thể tạo dịch vụ mới");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) {
      return;
    }

    try {
      await serviceService.deleteService(serviceId);
      setServices((prev) =>
        prev.filter((service) => service._id !== serviceId),
      );
    } catch (err) {
      setError("Không thể xóa dịch vụ");
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getHotelBookings();
      const payload = res.data.data;
      setBookings(Array.isArray(payload) ? payload : payload?.bookings || []);
    } catch (err) {
      setError("Không thể tải booking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await roomService.getRoomsByHotel(hotelId);
      setRooms(res.data.data || []);
    } catch (err) {
      setError("Không thể tải phòng");
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await serviceService.getServicesByHotel(hotelId);
      setServices(res.data.data || []);
    } catch (err) {
      setError("Không thể tải dịch vụ");
      console.error(err);
    }
  };

  const fetchHotelInfo = async () => {
    try {
      const res = await hotelManagementService.getHotelInfo(hotelId);
      setHotelInfo(res.data.data || {});
    } catch (err) {
      setError("Không thể tải thông tin khách sạn");
      console.error(err);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    if (confirm("Xác nhận booking này?")) {
      try {
        await bookingService.confirmBookingManager(bookingId);
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "confirmed" } : b,
          ),
        );
        alert("Xác nhận booking thành công");
      } catch (err) {
        alert("Xác nhận thất bại");
        console.error(err);
      }
    }
  };

  return (
    <div className="manager-dashboard">
      <h1>Quản lý Khách sạn</h1>

      <div className="manager-tabs">
        <button
          className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          📋 Quản lý Booking
        </button>
        <button
          className={`tab-btn ${activeTab === "rooms" ? "active" : ""}`}
          onClick={() => setActiveTab("rooms")}
        >
          🛏️ Quản lý Phòng
        </button>
        <button
          className={`tab-btn ${activeTab === "services" ? "active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          ✨ Quản lý Dịch vụ
        </button>
        <button
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          🏨 Thông tin KS
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Đang tải...</div>}

      {/* BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div className="tab-content">
          <h2>Quản lý Booking</h2>
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <strong>
                    {booking.user?.firstName ||
                      booking.guestInfo?.firstName ||
                      "Khách"}
                  </strong>
                  <p>
                    Điện thoại:{" "}
                    {booking.user?.phone || booking.guestInfo?.phone || "-"}
                  </p>
                  <p>
                    Ngày:{" "}
                    {new Date(booking.checkInDate).toLocaleDateString("vi-VN")}{" "}
                    →{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString("vi-VN")}
                  </p>
                  <p>Giá: {booking.totalPrice?.toLocaleString?.() || 0}₫</p>
                </div>
                <div className="booking-status">
                  <span className={`status ${booking.status}`}>
                    {booking.status}
                  </span>
                  <span className={`payment-status ${booking.paymentStatus}`}>
                    {booking.paymentStatus}
                  </span>
                  {booking.status === "pending" && (
                    <button onClick={() => handleConfirmBooking(booking._id)}>
                      Xác nhận
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROOMS TAB */}
      {activeTab === "rooms" && (
        <div className="tab-content">
          <h2>Quản lý Phòng</h2>
          <button className="btn-add">+ Thêm Phòng</button>
          <table className="manager-table">
            <thead>
              <tr>
                <th>Tên Phòng</th>
                <th>Giá (₫)</th>
                <th>Sức chứa</th>
                <th>Số lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.name}</td>
                  <td>{room.price.toLocaleString()}</td>
                  <td>{room.capacity}</td>
                  <td>{room.quantity}</td>
                  <td>
                    <button className="btn-edit">Sửa</button>
                    <button className="btn-delete">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SERVICES TAB */}
      {activeTab === "services" && (
        <div className="tab-content">
          <h2>Quản lý Dịch vụ</h2>
          <button className="btn-add">+ Thêm Dịch vụ</button>
          <table className="manager-table">
            <thead>
              <tr>
                <th>Tên Dịch vụ</th>
                <th>Giá (₫)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.price.toLocaleString()}</td>
                  <td>
                    <button className="btn-edit">Sửa</button>
                    <button className="btn-delete">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* HOTEL INFO TAB */}
      {activeTab === "info" && (
        <div className="tab-content">
          <h2>Thông tin Khách sạn</h2>
          <form className="hotel-form">
            <div className="form-group">
              <label>Tên khách sạn</label>
              <input
                type="text"
                value={hotelInfo.name}
                onChange={(e) =>
                  setHotelInfo({ ...hotelInfo, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                placeholder="Đường"
                value={hotelInfo.address.street}
              />
              <input
                type="text"
                placeholder="Thành phố"
                value={hotelInfo.address.city}
              />
              <input
                type="text"
                placeholder="Quốc gia"
                value={hotelInfo.address.country}
              />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea value={hotelInfo.description}></textarea>
            </div>
            <div className="form-group">
              <label>Tiện nghi</label>
              <div className="amenities-list">
                {hotelInfo.amenities.map((amenity) => (
                  <span key={amenity} className="amenity-tag">
                    {amenity} ✕
                  </span>
                ))}
              </div>
              <input type="text" placeholder="Thêm tiện nghi..." />
            </div>
            <button type="submit" className="btn-save">
              Lưu thay đổi
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
