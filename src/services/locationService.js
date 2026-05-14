import api from "./api";

const locationService = {
  getCities: async () => {
    const res = await api.get("/locations/cities");
    return res.data && res.data.data ? res.data.data : [];
  },

  getWards: async (cityCodeName) => {
    const res = await api.get(`/locations/cities/${cityCodeName}/wards`);
    return res.data && res.data.data ? res.data.data : [];
  },

  updateHotelAddress: async (payload) => {
    const res = await api.patch(`/hotels/me/address`, payload);
    return res.data && res.data.data ? res.data.data : res.data;``
  }
};

export default locationService;
