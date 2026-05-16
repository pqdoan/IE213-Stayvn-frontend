import api from "./api";

const bookingService = {
  getMyBookings: (params) => api.get(`/bookings/my-bookings`, { params }),
  cancelBooking: (bookingId) => api.patch(`/bookings/${bookingId}/cancel`),
  getBookingById: (bookingId) => api.get(`/bookings/${bookingId}`),
  // Manager endpoints
  getHotelBookings: (params) => api.get(`/bookings/manage`, { params }),
  confirmBookingManager: (bookingId) =>
    api.patch(`/bookings/${bookingId}/confirm`),
};

export default bookingService;
