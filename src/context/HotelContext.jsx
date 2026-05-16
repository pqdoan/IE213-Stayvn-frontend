import { createContext, useContext, useState } from "react";

const HotelContext = createContext({
  hotel: null,
  setHotel: () => {},
});

export const HotelProvider = ({ children }) => {
  const [hotel, setHotel] = useState(null);

  return (
    <HotelContext.Provider value={{ hotel, setHotel }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotelContext = () => useContext(HotelContext);
