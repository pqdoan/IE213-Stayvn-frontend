import api from "./api";

const serviceService = {
  // Get services by hotel
  getServicesByHotel: (hotelId) => api.get(`/services/hotel/${hotelId}`),

  // Create service
  createService: (data) => api.post(`/services`, data),

  // Update service
  updateService: (serviceId, data) => api.patch(`/services/${serviceId}`, data),

  // Delete service
  deleteService: (serviceId) => api.delete(`/services/${serviceId}`),

  // Get service by ID
  getServiceById: (serviceId) => api.get(`/services/${serviceId}`),
};

export default serviceService;
