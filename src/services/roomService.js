import api from "./api";

const roomService = {
  // Get rooms by hotel
  getRoomsByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),

  // Create room
  createRoom: (data) => api.post(`/rooms`, data),

  // Update room
  updateRoom: (roomId, data) => api.patch(`/rooms/${roomId}`, data),

  // Delete room
  deleteRoom: (roomId) => api.delete(`/rooms/${roomId}`),

  // Get room by ID
  getRoomById: (roomId) => api.get(`/rooms/${roomId}`),
};

export default roomService;
