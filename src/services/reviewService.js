import api from "./api";

const reviewService = {
  // fetch paginated reviews for a hotel
  // options can include date, from, to
  getHotelReviews: async (hotelId, page = 1, limit = 5, options = {}) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (options.date) params.set("date", options.date);
    if (options.from) params.set("from", options.from);
    if (options.to) params.set("to", options.to);

    const res = await api.get(`/reviews/hotel/${hotelId}?${params.toString()}`);
    // API now returns { reviews, avgRating, totalReviews, pagination }
    if (res.data && res.data.data) return res.data.data;
    return null;
  }
  ,
  // call the new endpoint that explicitly returns reviews filtered by date
  getHotelReviewsByDate: async (hotelId, date, page = 1, limit = 50) => {
    const params = new URLSearchParams();
    params.set("date", date);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await api.get(`/reviews/hotel/${hotelId}/by-date?${params.toString()}`);
    if (res.data && res.data.data) return res.data.data;
    return null;
  }
};

export default reviewService;
