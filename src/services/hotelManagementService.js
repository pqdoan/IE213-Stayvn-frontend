import api from "./api";

const hotelManagementService = {
  // Get hotel info for manager
  getHotelInfo: (hotelId) => api.get(`/hotels/${hotelId}`),

  // Update hotel info
  updateHotelInfo: (data) => api.patch(`/hotels`, data),

  // Get hotel owner hotel
  getMyHotels: () => api.get(`/hotels/me`),

  // Get all hotels (for admin)
  getAllHotels: (params) => api.get(`/hotels`, { params }),

  // Approve hotel (admin)
  approveHotel: (hotelId) => api.patch(`/hotels/${hotelId}/approve`),

  // Reject hotel (admin)
  rejectHotel: (hotelId) => api.patch(`/hotels/${hotelId}/reject`),

  // Block hotel (admin)
  blockHotel: (hotelId) => api.patch(`/hotels/${hotelId}/block`),

  // Unblock hotel (admin)
  unblockHotel: (hotelId) => api.patch(`/hotels/${hotelId}/unblock`),
};

export default hotelManagementService;
