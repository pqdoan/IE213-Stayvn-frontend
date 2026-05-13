/* ==============================================
   AUTH SERVICE
============================================== */

import api from "./api";

const authService = {
  // REGISTER
  register: (data) => api.post("/auth/register", data),

  // LOGIN
  login: (data) => api.post("/auth/login", data),

  //GET PROFILE

  getProfile: () => api.get("/users/me"),
};

export default authService;
