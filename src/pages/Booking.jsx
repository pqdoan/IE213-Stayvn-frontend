import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import hotelService from "../services/hotelService";
import paymentService from "../services/paymentService";
import { useHotelContext } from "../context/HotelContext";
import "../styles/Booking.css";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel: hotelFromContext } = useHotelContext();
  const [hotel, setHotel] = useState(hotelFromContext || null);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [guests, setGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const bookingState = location.state?.hotel;

  useEffect(() => {
    if (bookingState) {
      setHotel(bookingState);
    }
  }, [bookingState]);

  useEffect(() => {
    if (!hotel) return;

    const fetchRooms = async () => {
      try {
        const response = await hotelService.getRoomsByHotel(hotel._id);
        setRooms(response.data?.data || []);
      } catch (error) {
        console.error("Lỗi tải phòng:", error);
        setMessage("Không thể tải danh sách phòng của khách sạn.");
      }
    };

    fetchRooms();
  }, [hotel]);

  const roomOptions = useMemo(() => {
    if (!rooms.length) return [];
    return rooms.map((room) => ({
      roomId: room._id,
      name: room.name,
      capacity: room.capacity,
      price: room.price,
      quantity: 0,
    }));
  }, [rooms]);

  useEffect(() => {
    if (roomOptions.length && selectedRooms.length === 0) {
      setSelectedRooms(roomOptions);
    }
  }, [roomOptions, selectedRooms.length]);

  const handleRoomQuantity = (roomId, value) => {
    setSelectedRooms((prev) =>
      prev.map((item) =>
        item.roomId === roomId
          ? { ...item, quantity: Math.max(0, Number(value)) }
          : item,
      ),
    );
  };

  const selectedRoomList = selectedRooms.filter((item) => item.quantity > 0);

  const roomTotal = useMemo(() => {
    const nights = getNights(checkInDate, checkOutDate);
    return selectedRoomList.reduce(
      (sum, item) => sum + item.price * item.quantity * nights,
      0,
    );
  }, [selectedRoomList, checkInDate, checkOutDate]);

  const phone = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).phone || ""
    : "";

  const handleBooking = async () => {
    if (!hotel) {
      setMessage("Vui lòng chọn khách sạn để đặt phòng.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setMessage("Vui lòng chọn ngày nhận và trả phòng.");
      return;
    }

    if (getNights(checkInDate, checkOutDate) <= 0) {
      setMessage("Ngày trả phải sau ngày nhận phòng.");
      return;
    }

    if (!selectedRoomList.length) {
      setMessage("Vui lòng chọn ít nhất một phòng.");
      return;
    }

    const payload = {
      rooms: selectedRoomList.map((item) => ({
        roomId: item.roomId,
        quantity: item.quantity,
      })),
      checkInDate,
      checkOutDate,
      guests,
      services: [],
    };

    try {
      setLoading(true);
      setMessage("");
      const response = await hotelService.createBooking(hotel._id, payload);
      const booking = response.data?.data;
      setCreatedBooking(booking);
      setBookingCreated(true);
      setMessage(
        "Đặt phòng thành công. Vui lòng tiếp tục thanh toán để hoàn tất.",
      );
    } catch (error) {
      console.error("Lỗi tạo booking:", error);
      setMessage(
        error?.response?.data?.message ||
          "Đã có lỗi khi đặt phòng. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!createdBooking || !createdBooking._id) {
      setMessage("Không tìm thấy booking để thanh toán.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const response = await paymentService.createMockPayment(
        createdBooking._id,
      );
      const paymentUrl = response.data?.paymentUrl;
      if (!paymentUrl) {
        throw new Error("Không thể tạo đường dẫn thanh toán.");
      }
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Lỗi tạo thanh toán:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);
      setMessage(
        error?.response?.data?.message ||
          "Đã có lỗi khi tạo yêu cầu thanh toán. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const summaryNights = getNights(checkInDate, checkOutDate);

  return (
    <div className="booking-page">
      <h1 className="booking-heading">Đặt phòng</h1>

      {message && <div className="booking-message">{message}</div>}

      {!hotel ? (
        <div className="booking-form">
          <p>Vui lòng vào trang chi tiết khách sạn và nhấn "Đặt phòng ngay".</p>
          <button
            className="button-primary"
            onClick={() => navigate("/hotels")}
          >
            Tìm khách sạn
          </button>
        </div>
      ) : (
        <div className="booking-grid">
          <div className="booking-form">
            <div className="booking-section">
              <h3>Khách sạn</h3>
              <div className="booking-hotel-card">
                <img
                  src={
                    hotel.image?.[0]?.url || import.meta.env.VITE_FALLBACK_IMAGE
                  }
                  alt={hotel.name}
                />
                <div className="booking-hotel-card-body">
                  <h2>{hotel.name}</h2>
                  <p>{hotel.address?.city || "Địa điểm chưa xác định"}</p>
                  <p>{hotel.description || "Không có mô tả"}</p>
                </div>
              </div>
            </div>

            <div className="booking-section">
              <h3>Thời gian</h3>
              <div className="booking-row">
                <input
                  type="date"
                  className="booking-input"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
                <input
                  type="date"
                  className="booking-input"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
            </div>

            <div className="booking-section">
              <h3>Thông tin khách</h3>
              <input
                type="number"
                min="1"
                className="booking-input"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                placeholder="Số khách"
              />
              <input
                type="text"
                className="booking-input"
                value={phone}
                disabled
                placeholder="Số điện thoại"
              />
            </div>

            <div className="booking-section">
              <h3>Chọn phòng</h3>
              {rooms.length === 0 ? (
                <p>Đang tải phòng hoặc khách sạn chưa có phòng.</p>
              ) : (
                rooms.map((room) => {
                  const selected = selectedRooms.find(
                    (item) => item.roomId === room._id,
                  );
                  return (
                    <div key={room._id} className="room-card">
                      <h4>{room.name}</h4>
                      <div className="room-meta">
                        <span>Số lượng: {room.quantity}</span>
                        <span>Người: {room.capacity}</span>
                        <span>Giá: {room.price.toLocaleString()}₫/đêm</span>
                      </div>
                      <div className="room-actions">
                        <input
                          type="number"
                          className="booking-input"
                          min="0"
                          value={selected?.quantity ?? 0}
                          onChange={(e) =>
                            handleRoomQuantity(room._id, e.target.value)
                          }
                        />
                        <span>Chọn</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <aside className="booking-summary">
            <h3>Tóm tắt đơn</h3>
            <div className="summary-row">
              <span>Ngày nhận</span>
              <span>{checkInDate || "Chưa chọn"}</span>
            </div>
            <div className="summary-row">
              <span>Ngày trả</span>
              <span>{checkOutDate || "Chưa chọn"}</span>
            </div>
            <div className="summary-row">
              <span>Số đêm</span>
              <span>{summaryNights || 0}</span>
            </div>
            <div className="summary-row">
              <span>Số phòng</span>
              <span>{selectedRoomList.length}</span>
            </div>
            <div className="summary-row">
              <span>Tổng giá phòng</span>
              <span>{roomTotal.toLocaleString()}₫</span>
            </div>
            <div className="summary-total">
              <span>Thanh toán</span>
              <span>{roomTotal.toLocaleString()}₫</span>
            </div>
            {bookingCreated ? (
              <>
                <div className="booking-info">
                  <p>Mã booking: {createdBooking?._id}</p>
                  <p>Trạng thái: {createdBooking?.status || "pending"}</p>
                  <p>Thanh toán: {createdBooking?.paymentStatus || "unpaid"}</p>
                </div>
                <button
                  className="button-primary"
                  disabled={loading}
                  onClick={handlePayment}
                >
                  {loading ? "Đang chuyển đến thanh toán..." : "Thanh toán"}
                </button>
                <button
                  className="button-secondary"
                  onClick={() => navigate("/my-bookings")}
                >
                  Xem đơn của tôi
                </button>
              </>
            ) : (
              <button
                className="button-primary"
                disabled={loading}
                onClick={handleBooking}
              >
                {loading ? "Đang đặt..." : "Xác nhận đặt phòng"}
              </button>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

const getNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diff = end.getTime() - start.getTime();
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

export default Booking;
