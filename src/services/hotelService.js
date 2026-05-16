// /* ============================================== */
// /*  HOTEL SERVICE */
// /* ============================================== */

// import api from "./api";

// const hotelService = {
//   // GET ALL HOTELS
//   // getAll: (params) => api.get("/hotels", { params }),
//   getAll: (params) => api.get("/hotels?limit=100", { params }),

//   // GET ALL HOTELS
//   getAll: (params) => api.get("/hotels", { params }),

//   // GET HOTEL DETAIL
//   getById: (id) => api.get(`/hotels/${id}`),

//   // GET HOTEL ROOMS
//   getRoomsByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),

//   // GET HOTEL SERVICES
//   getServicesByHotel: (hotelId) => api.get(`/services/hotel/${hotelId}`),

//   checkAvailability: (roomId, checkInDate, checkOutDate) =>
//     api.get(`/bookings/room/${roomId}/availability`, {
//       params: {
//         checkInDate,
//         checkOutDate,
//       },
//     }),

//   // CREATE HOTEL
//   create: (data) => api.post("/hotels", data),

//   // CREATE BOOKING
//   createBooking: (hotelId, data) =>
//     api.post(`/bookings/hotel/${hotelId}`, data),

//   // UPDATE HOTEL
//   update: (data) => api.patch("/hotels", data),

//   // UPLOAD HOTEL IMAGES
//   uploadImages: (formData) =>
//     api.patch("/hotels/me/images", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }),

//   // DELETE HOTEL IMAGE
//   deleteImage: (publicId) =>
//     api.delete(`/hotels/me/images?public_id=${publicId}`),

//   // GET HOTEL DETAIL
//   getById: (id) => api.get(`/hotels/${id}`),
// };

// export default hotelService;

/* ============================================== */
/*  HOTEL SERVICE */
/* ============================================== */

/* ============================================== */
/*  HOTEL SERVICE */
/* ============================================== */

import api from "./api";

const hotelService = {
  // GET ALL HOTELS
  getAll: (params) => api.get("/hotels", { params }),

  // GET HOTEL DETAIL
  getById: (id) => api.get(`/hotels/${id}`),

  // GET HOTEL ROOMS
  getRoomsByHotel: (hotelId) => api.get(`/rooms/hotel/${hotelId}`),

  // GET HOTEL SERVICES
  getServicesByHotel: (hotelId) => api.get(`/services/hotel/${hotelId}`),

  checkAvailability: (roomId, checkInDate, checkOutDate) =>
    api.get(`/bookings/room/${roomId}/availability`, {
      params: {
        checkInDate,
        checkOutDate,
      },
    }),

  // CREATE HOTEL
  create: (data) => api.post("/hotels", data),

  // CREATE BOOKING
  createBooking: (hotelId, data) =>
    api.post(`/bookings/hotel/${hotelId}`, data),

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
