import api from "./api";

const adminService = {
  // Get all users
  getAllUsers: (params) => api.get(`/users`, { params }),

  // Get user by ID
  getUserById: (userId) => api.get(`/users/${userId}`),

  // Block user
  blockUser: (userId) =>
    api.patch(`/users/${userId}/status`, { status: "blocked" }),

  // Unblock user
  unblockUser: (userId) =>
    api.patch(`/users/${userId}/status`, { status: "active" }),

  // Update user role
  updateUserRole: (userId, role) =>
    api.patch(`/users/${userId}/role`, { role }),

  // Get all hotels with status filter for admin review
  getHotelsForReview: (params) => api.get(`/admin/hotels`, { params }),

  // Approve hotel (admin)
  approveHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/approve`),

  // Reject hotel (admin)
  rejectHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/reject`),

  // Block hotel (admin)
  blockHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/block`),

  // Unblock hotel (admin)
  unblockHotel: (hotelId) => api.patch(`/admin/hotels/${hotelId}/unblock`),

  // Get dashboard stats
  getDashboardStats: () => api.get(`/admin/stats`),

  // Get revenue report
  getRevenueReport: (params) => api.get(`/admin/revenue`, { params }),
};

export default adminService;
