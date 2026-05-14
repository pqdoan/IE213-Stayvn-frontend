import api from "./api";

const bookingService = {
  getHotelBookings: async (params) => {
    // GET /bookings/manage
    const res = await api.get(`/bookings/manage`, { params });
    return res.data && res.data.data ? res.data.data : { bookings: [], pagination: {} };
  },

  confirmBooking: async (bookingId) => {
    const res = await api.patch(`/bookings/${bookingId}/confirm`);
    return res.data;
  }
};

export default bookingService;
