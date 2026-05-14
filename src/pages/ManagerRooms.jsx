import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import hotelService from "../services/hotelService";
import roomService from "../services/roomService";
import { formatCurrency } from "../utils/formatCurrency";
import Swal from 'sweetalert2';

export default function ManagerRooms() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [hotelStats, setHotelStats] = useState({
    hotelId: "",
    totalRooms: "",  
    totalAvailable: "",
    totalBooked: "", 
    occupancyRate: "",
  });
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [roomUpdateForm, setRoomUpdateForm] = useState({
    name: "",
    price: "",
    description: "",
    amenities: "",
    capacity: "",
    quantity: ""
  });

  useEffect(() => {
    let mounted = true;
    
    if (!hotelId) return;

    const fetchStats = async () => {
      try {
        const response = await hotelService.getHotelStats(hotelId);
        
        if (mounted && response) {
          // Lưu ý: Đảm bảo truyền đúng object có cấu trúc giống useState ban đầu
          // Giả sử API trả về { success: true, data: { ... } }
          setHotelStats(response); 
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      }
    };

    fetchStats();

    // Cleanup function
    return () => { mounted = false; };
    
    // Thêm hotelId và isDirty để tự động load lại khi cần
  }, [hotelId, isDirty]);

  useEffect(() => {
    let mounted = true;
    if (!hotelId) return;

    hotelService.getHotelById(hotelId)
      .then((h) => mounted && setHotel(h))
      .catch(() => mounted && setHotel(null));

    // fetch rooms
    import("../services/roomService").then((m) => {
      m.default
        .getRoomsByHotel(hotelId)
        .then((r) => {
          if (!mounted) return;

          setRooms(r);

        })
        .catch(() => {});
    });

    return () => (mounted = false);
  }, [hotelId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setRoomUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        name: roomUpdateForm.name || undefined,
        price: roomUpdateForm.price !== "" ? roomUpdateForm.price : undefined,
        description: roomUpdateForm.description || undefined,
        capacity: roomUpdateForm.capacity !== "" ? roomUpdateForm.capacity : undefined,
        quantity: roomUpdateForm.quantity !== "" ? roomUpdateForm.quantity : undefined,
        amenities: roomUpdateForm.amenities
          ? roomUpdateForm.amenities
              .split(",")
              .map(i => i.trim())
              .filter(Boolean)
          : undefined,
      };

      const token = localStorage.getItem("token");
      const updatedRoom = await roomService.updateRoom(selectedRoom._id, submitData, token);
      alert("Cập nhật thành công");

      const updatedRooms = await roomService.getRoomsByHotel(hotelId);
      setRooms(updatedRooms); 
      setSelectedRoom(null);
      setRoomUpdateForm({
        name: "",
        price: "",
        description: "",
        amenities: "",
        capacity: "",
        quantity: ""
      })
      setIsDirty(false);
    } catch (error) {
      alert(
        "Cập nhật thất bại: " +
          (error?.response?.data?.message ||
            error.message)
      );
    }
  };

  const confirmDelete = (roomId, roomName) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn sẽ không thể khôi phục phòng "${roomName}" sau khi xóa!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4f', // Màu đỏ cho nút xóa
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true // Đổi vị trí nút Hủy sang trái, Xóa sang phải
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteRoom(roomId);
      }
    });
  };

  const handleDeleteRoom = async (roomId) => {
    const token = localStorage.getItem("token");

    try {
      await roomService.deleteRoom(roomId, token);

      if (hotelId) {
        const updatedRooms = await roomService.getRoomsByHotel(hotelId);
        setRooms(updatedRooms);
      } 
      
      Swal.fire({
        title: 'Đã xóa!',
        text: 'Phòng đã được gỡ khỏi hệ thống.',
        icon: 'success',
        timer: 1500, // Tự đóng sau 1.5 giây
        showConfirmButton: false // Ẩn nút OK đi cho gọn
      });
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      Swal.fire({
        icon: 'error',
        title: 'Xóa thất bại',
        text: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau!",
        footer: '<a href="#">Tại sao tôi gặp lỗi này?</a>' // Thêm link hỗ trợ nếu muốn
      });
    }
  };

  return (
    <div className="manager-dashboard">
      <section className="manager-page-header">
        <div>
          <p className="eyebrow">Quản lý phòng</p>
          <h1>Phòng của {hotel ? hotel.name : "..."}</h1>
          <p>Thêm, sửa, xóa phòng, upload hình ảnh và quản lý số lượng phòng theo loại.</p>
        </div>
        <Button className="manager-card-link">Thêm phòng</Button>
      </section>

      <section className="manager-stats owner-stats">
        <Card className="stat-card">
          <span>Số phòng còn trống</span>
          <strong>{hotelStats.totalAvailable}</strong>
          <small>Trên tổng số {hotelStats.totalRooms} phòng</small>
        </Card>
        <Card className="stat-card">
          <span>Số phòng đã đặt</span>
          <strong>{hotelStats.totalBooked}</strong>
          <small>Trên tổng số {hotelStats.totalRooms} phòng</small>
        </Card>
      </section>

      <Card className="management-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">Cập nhật</p>
            <h2>Thông tin phòng</h2>
          </div>
        </div>

        <form className="manager-form form-grid-2" onSubmit={handleUpdateSubmit}>
          <label>
            <span>Chọn phòng</span>
            <select
              value={selectedRoom?._id || ""}
              onChange={(e) => {
                const room = rooms.find((r) => String(r._id) === e.target.value);

                setSelectedRoom(room || null);

                if (room) {
                  setRoomUpdateForm({
                    name: room.name || "",
                    price: room.price || "",
                    description: room.description || "",
                    amenities: room.amenities?.join(", ") || "",
                    capacity: room.capacity || "",
                    quantity: room.totalQuantity || "",
                  });
                } else {
                  setRoomUpdateForm({
                    name: "",
                    price: "",
                    description: "",
                    amenities: "",
                    capacity: "",
                    quantity: ""
                  });
                }
              }}
            >
              <option value="">Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Tên phòng</span>
            <input
              type="text"
              name="name"
              placeholder="Cập nhật tên phòng"
              value={roomUpdateForm.name || ""}
              onChange={handleInputChange}
            />
          </label>

          <label>
            <span>Giá/đêm (VNĐ)</span>
            <input
              type="number"
              name="price"
              placeholder="Cập nhật giá phòng"
              value={roomUpdateForm.price || ""}
              onChange={handleInputChange}
            />
          </label>

          <label>
            <span>Tiện ích</span>
            <input
              type="text"
              name="amenities"
              placeholder="Cập nhật các tiện ích"
              value={roomUpdateForm.amenities || ""}
              onChange={handleInputChange}
            />
          </label>

          <label className="label-two-col">
            <span>Mô tả</span>
            <textarea
              rows="2"
              name="description"
              placeholder="Cập nhật mô tả"
              value={roomUpdateForm.description || ""}
              onChange={handleInputChange}
            />
          </label>

          <label>
            <span>Sức chứa</span>
            <input
              type="number"
              name="capacity"
              placeholder="Cập nhật sức chứa"
              value={roomUpdateForm.capacity || ""}
              onChange={handleInputChange}
            />
          </label>

          <label>
            <span>Số lượng phòng</span>
            <input
              type="number"
              name="quantity"
              placeholder="Cập nhật số lượng phòng"
              value={roomUpdateForm.quantity || ""}
              onChange={handleInputChange}
            />
          </label>

          <div className="form-actions">
            <Button 
              disabled={!isDirty} 
              type="submit" 
              variant="primary"
            >Lưu thông tin phòng</Button>
          </div>
        </form>
      </Card>

      <section className="management-container-card">
        {rooms.map((room) => (
          <div className="room-card">
            <div className="room-layout">
              
              {/* IMAGE */}
              <div className="room-image">
                <img
                  src={room.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                  alt={room.name}
                />
              </div>

              {/* CONTENT */}
              <div className="room-content">
                
                <div className="room-header">
                  <div>
                    <h3 className="room-name">{room.name}</h3>
                    <p className="room-description">{room.description}</p>
                  </div>

                  <div className="room-price">
                    <span className="price">
                      {formatCurrency(room.price)}
                      <small>/đêm</small>
                    </span>
                  </div>
                </div>

                <div className="room-meta">
                  <div className="meta-item">
                    <span className="label">Sức chứa: </span>
                    <span className="value">{room.capacity} người</span>
                  </div>

                  <div className="meta-item">
                    <span className="label">Tổng phòng: </span>
                    <span className="value">{room.totalQuantity}</span>
                  </div>

                  <div className="meta-item">
                    <span className="label">Còn trống: </span>
                    <span className={room.availableQuantity === 0 ? "value danger" : "value success"}>
                      {room.availableQuantity}
                    </span>
                  </div>
                </div>

                <div className="amenities-list">
                  Tiện nghi:
                  {room.amenities?.map((item, index) => (
                    <span key={index} className="amenity-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="room-actions">
                <Button onClick={() => confirmDelete(room._id, room.name)}>Xóa</Button>
              </div>
            </div>
        </div>))}
      </section>
    </div>
  );
}
