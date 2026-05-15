import api from "./api";

const adminService = {
  getHotels: (params) => api.get("/admin/hotels", { params }),

  getHotelDetail: (hotelId) => api.get(`/admin/hotels/hotel/${hotelId}`),

  approveHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/approve`),

  rejectHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/reject`),

  blockHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/block`),

  unblockHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/unblock`),

  getUsers: (params) => api.get("/users", { params }),

  updateUserStatus: (userId, status) =>
    api.patch(`/users/${userId}/status`, { status }),
};

export default adminService;
