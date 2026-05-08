import { useEffect, useState } from "react";
import "./Home.css";

import hotelService from "../services/hotelService";

import DestinationSection from "../components/hotel/DestinationSection";
import HotelGrid from "../components/hotel/HotelGrid";
import FeatureSection from "../components/hotel/FeatureSection";
import SearchSection from "../components/hotel/SearchSection"; // import đúng

const Home = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await hotelService.getAll();
      const hotelsData = res?.data?.data?.hotels || [];
      setHotels(hotelsData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home">
      <SearchSection />

      <DestinationSection />
      <HotelGrid hotels={hotels} />
      <FeatureSection />
    </div>
  );
};

export default Home;
