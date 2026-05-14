import { create } from "zustand";

// Simple auth store using localStorage for persistence
const getInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { token, user };
  } catch (e) {
    return { token: null, user: null };
  }
};

const useAuthStore = create((set) => ({
  ...getInitialState(),

  setAuth: (token, user) => {
    try {
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      // ignore storage errors
    }

    set({ token, user });
  },

  logout: () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }

    set({ token: null, user: null });
  }
}));

export default useAuthStore;
