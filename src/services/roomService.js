import api from "./api";

const roomService = {
  getRoomsByHotel: async (hotelId, params) => {
    const res = await api.get(`/rooms/hotel/${hotelId}`, { params });
    return res.data && res.data.data ? res.data.data : [];
  },

  getRoomById: async (roomId) => {
    const res = await api.get(`/rooms/${roomId}`);
    return res.data && res.data.data ? res.data.data : null;
  },

  updateRoom: async (roomId, data, token) => {
    const res = await api.patch(`/rooms/${roomId}`, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.data && res.data.data ? res.data.data : null;
  },

  deleteRoom: async (roomId, token) => {
    const res = await api.delete(`/rooms/${roomId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.data && res.data.data ? res.data.data : null;
  }
};

export default roomService;
