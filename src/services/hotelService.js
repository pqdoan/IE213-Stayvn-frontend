/* ========== Hotel Service =========*/
import api from "./api";

const hotelService = {
  // GET ALL HOTELS
  getAll: (params) => api.get("/hotels?limit=100", { params }),

  // GET HOTEL DETAIL
  getById: (id) => api.get(`/hotels/${id}`),

  // CREATE HOTEL
  create: (data) => api.post("/hotels", data),

  // UPDATE HOTEL
  update: (data) => api.patch("/hotels", data),

  // UPLOAD HOTEL IMAGES
  uploadImages: (formData) =>
    api.patch("/hotels/me/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // DELETE HOTEL IMAGE
  deleteImage: (publicId) =>
    api.delete(`/hotels/me/images?public_id=${publicId}`),
};

export default hotelService;
