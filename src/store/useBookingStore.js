import { create } from "zustand";

export const useBookingStore = create((set) => ({
  bookings: [],
  addBooking: (b) => set((state) => ({ bookings: [...state.bookings, b] })),
}));
