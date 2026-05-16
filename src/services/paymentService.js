import api from "./api";

const paymentService = {
  createPayment: (bookingId) => api.post("/payments/create", { bookingId }),
  createMockPayment: (bookingId) =>
    api.post("/payments/mock/create", { bookingId }),
  completeMockPayment: (paymentId) =>
    api.patch(`/payments/mock/${paymentId}/complete`),
  getPaymentByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  confirmPayment: (bookingId) => api.patch(`/payments/${bookingId}/confirm`),
};

export default paymentService;
