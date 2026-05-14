import api from "./api";

const serviceService = {
  getServicesByHotel: async (hotelId) => {
    const res = await api.get(`/services/hotel/${hotelId}`);
    return res.data && res.data.data ? res.data.data : [];
  }
};

export default serviceService;
