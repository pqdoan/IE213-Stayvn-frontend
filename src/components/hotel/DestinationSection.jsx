import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import DestinationCard from "./DestinationCard";

const destinations = [
  {
    name: "Vinpearl Luxury",
    description: "Resort với hồ bơi vô cực",
    address: "Nha Trang, Khánh Hòa",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  },
  {
    name: "Danang Resort",
    description: "Khu nghỉ dưỡng ven biển",
    address: "Đà Nẵng",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  },
  {
    name: "Villas Dalat",
    description: "Biệt thự cổ điển",
    address: "Đà Lạt, Lâm Đồng",
    image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  },
  {
    name: "Phu Quoc",
    description: "Resort 5 sao bên bờ biển",
    address: "Phú Quốc, Kiên Giang",
    image: "https://images.pexels.com/photos/261398/pexels-photo-261398.jpeg",
  },
  {
    name: "Hoi An Resort",
    description: "Phố cổ bên bờ biển",
    address: "Hội An, Quảng Nam",
    image: "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg",
  },
  {
    name: "Ho Tram",
    description: "Khu nghỉ dưỡng ven biển",
    address: "Hồ Tràm, Bà Rịa - Vũng Tàu",
    image: "https://images.pexels.com/photos/261398/pexels-photo-261398.jpeg",
  },
  {
    name: "Quy Nhon",
    description: "Biệt thự ven biển sang trọng",
    address: "Quy Nhơn, Bình Định",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  },
  {
    name: "Cam Ranh",
    description: "Resort phong cách Indochine",
    address: "Cam Ranh, Khánh Hòa",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  },
  {
    name: "Six Senses",
    description: "Ẩn mình giữa thiên nhiên",
    address: "Ninh Hòa, Khánh Hòa",
    image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
  },
  {
    name: "Resort Danang",
    description: "Resort lâu đời phong cách Á Đông",
    address: "Đà Nẵng",
    image: "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg",
  },
];

const DestinationSection = () => {
  return (
    <section className="destination-section">
      <h2>Điểm đến phổ biến</h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay]} // 👈 bắt buộc để autoplay hoạt động
      >
        {destinations.map((d, i) => (
          <SwiperSlide key={i}>
            <DestinationCard destination={d} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default DestinationSection;
